import { List } from '../Collections/List';
import { IPersister } from './Persisters/IPersister';
import { Queryable } from '../Collections/Queryable';
import { ISerializer } from '../Utility/Serialization/ISerializer';
import { Errors } from '../Errors';
import { Validator } from '../Patterns/Validator/Validator';
import { Result } from '../Patterns/Result/Result';

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

  private savedData: Array<T>;

  constructor(
    private persister: IPersister,
    private validator: Validator<T> = new Validator<T>([]),
    private serializer?: ISerializer<T>,
    private serializeAs?: { new(): T; }
  ) {
    super();
    let initialData = persister.Retrieve();
    initialData = initialData && initialData.length >= 1 ? initialData : new Array<T>();
    this.Item = serializer && serializeAs ? this.getSerializedInstancesFromInitialData(initialData) : initialData;
    this.savedData = this.Item;
  }

  /**
   * Calls the underlying persister's "Persist" method saving the data currently in the list
   */
  public SaveChanges(): void {
    this.persister.Persist(this.Item);
    this.savedData = this.Item;
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
    return this.Except(this.savedData);
  }

  /**
   * Returns a collection of elements that have not been removed from persistence
   */
  public GetUnpurgedElements(): Queryable<T> {
    return Queryable.From(this.savedData).Except(this.item);
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
    const result = new Result();

    elements.forEach(element => {
      result.ErrorMessages = result.ErrorMessages.concat(this.itemIsValid(element).ErrorMessages);
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
    const result = new Result();

    collection.ForEach(i => result.ErrorMessages =
      result.ErrorMessages.concat(this.itemIsValid(i).ErrorMessages));

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
        throw new Error(`${Errors.InvalidOperation} - cannot attempt serialization without a serializer and a class constructor`);
      }
    });
    return classInstances;
  }

  private itemIsValid(item: T): Result {
    return this.validator.Validate(item);
  }
}
