import { List } from '../Collections/List';
import { IPersister } from './Persisters/IPersister';
import { Queryable } from '../Collections/Queryable';
import { ISerializer } from '../Utility/Serialization/ISerializer';
import { Errors } from '../Errors';
import { Validator } from '../Patterns/Validator/Validator';
import { Result } from '../Patterns/Result/Result';
import { LogEntry, Logger, LogLevel } from '../Utility/Logger/module';

/**
 * An extension of the List<T> class that incorporates persistence functionality
 * provided by a class implementing IPersistable.  Previously persisted data is
 * loaded on instantiation using the default persister's "Retrieve" method.
 */
export class Repository<T> extends List<T> {
  /**
   * A set of rules the repository will check against when new elements are added
   * Rules that have a severity of "Error" will not be added
   */
  public get PendingChanges(): { PendingSave: Queryable<T>, PendingDeletion: Queryable<T> } {
    return {
      PendingSave: this.GetUnsavedElements(),
      PendingDeletion: this.GetUnpurgedElements()
    };
  }

  private savedData = { raw: '', referential: [] as Array<T> };

  constructor(
    private persister: IPersister,
    private validator: Validator<T> = new Validator<T>([]),
    private serializer?: ISerializer,
    private serializeAs?: { new(): T; }
  ) {
    super();
    let initialData = persister.Retrieve();
    initialData = initialData && initialData.length >= 1 ? initialData : new Array<T>();
    this.Item = serializer && serializeAs ? this.getSerializedInstancesFromInitialData(initialData) : initialData;
    this.setSavedData();
  }

  /**
   * Calls the underlying persister's "Persist" method saving the data currently in the list
   */
  public SaveChanges(): Result {
    let result = new Result();

    this.GetUnsavedElements().item.slice().forEach(element => {
      result = result.CombineWith(this.itemIsValid(element));
    });

    this.GetUnpurgedElements().item.slice().forEach(element => {
      result = result.CombineWith(this.itemIsValid(element));
    });

    if (result.IsSuccess) {
      this.persister.Persist(this.Item);
      this.setSavedData();
    }

    return result;
  }

  /**
   * Calls the underlying persister's "Purge" method deleting any data previously persisted and clearing the list
   */
  public PurgeData(): void {
    this.persister.Purge();
    this.Clear();
  }

  /**
   * Returns a collection of elements that have not been saved
   */
  public GetUnsavedElements(): Queryable<T> {
    return Queryable.From(this.item.filter(i => this.savedData.raw.indexOf(JSON.stringify(i)) < 0));
  }

  /**
   * Returns a collection of elements that have not been removed from persistence
   */
  public GetUnpurgedElements(): Queryable<T> {
    return Queryable.From(this.savedData.referential).Except(this.item);
  }

  //#region Overrides
  public Add(object: T): Result {
    const result = this.itemIsValid(object);

    if (result.IsSuccess) {
      super.Add(object);
    }

    return result;
  }

  public AddRange(elements: Array<T>): Result {
    let result = new Result();

    elements.forEach(element => {
      result = result.CombineWith(this.itemIsValid(element));
    });

    if (result.IsSuccess) {
      super.AddRange(elements);
    }

    return result;
  }

  public Insert(index: number, item: T): Result {
    const result = this.itemIsValid(item);

    if (result.IsSuccess) {
      super.Insert(index, item);
    }

    return result;
  }

  public InsertRange(index: number, collection: List<T>): Result {
    let result = new Result();

    collection.ForEach(i => result = result.CombineWith(this.itemIsValid(i)));

    if (result.IsSuccess) {
      super.InsertRange(index, collection);
    }

    return result;
  }
  //#endregion

  private getSerializedInstancesFromInitialData(initialData: Array<any>): Array<T> {
    const classInstances = new Array<T>();
    initialData.forEach(element => {
      if (this.serializer && this.serializeAs) {
        classInstances.push(this.serializer.Serialize(this.serializeAs, element));
      } else {
        const error = new Error(
          `${Errors.InvalidOperation} - cannot attempt serialization without a serializer and a class constructor`);
        Logger.Instance.Log(new LogEntry(Errors.InvalidOperation, LogLevel.Error, error));
        throw error;
      }
    });
    return classInstances;
  }

  private itemIsValid(item: T): Result {
    return this.validator.Validate(item);
  }

  private setSavedData(): void {
    this.savedData = {
      raw: JSON.stringify(this.Item),
      referential: this.Item.slice()
    };
  }
}
