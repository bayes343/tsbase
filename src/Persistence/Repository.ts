import { IPersister } from './Persisters/IPersister';
import { Queryable } from '../Collections/Queryable';
import { ISerializer } from '../Utility/Serialization/ISerializer';
import { Errors } from '../Errors';
import { Validator } from '../Patterns/Validator/Validator';
import { Result } from '../Patterns/Result/Result';
import { LogEntry, Logger, LogLevel } from '../Utility/Logger/module';
import { Strings } from '../System/Strings';

/**
 * An extension of the List<T> class that incorporates persistence functionality
 * provided by a class implementing IPersistable.  Previously persisted data is
 * loaded on instantiation using the default persister's "Retrieve" method.
 */
export class Repository<T> extends Queryable<T> {
  protected constructor() { super(); }

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

  private savedData = { raw: Strings.Empty, referential: [] as Array<T> };
  private persister!: IPersister;
  private validator: Validator<T> = new Validator<T>([]);
  private serializer?: ISerializer;
  private serializeAs?: { new(): T; };

  public static New<T>(
    persister: IPersister,
    validator: Validator<T> = new Validator<T>([]),
    serializer?: ISerializer,
    serializeAs?: { new(): T; }
  ): Repository<T> {
    const repository = Object.create(Repository.prototype) as Repository<T>;
    repository.persister = persister;
    repository.validator = validator;
    repository.serializer = serializer;
    repository.serializeAs = serializeAs;

    let initialData = Queryable.From(repository.persister.Retrieve());
    initialData = initialData && initialData.length >= 1 ? initialData : Queryable.From([]);

    repository.push(...(repository.serializer && repository.serializeAs ?
      repository.getSerializedInstancesFromInitialData(initialData) : initialData));
    repository.setSavedData();

    return repository;
  }

  /**
   * Calls the underlying persister's "Persist" method saving the data currently in the list
   */
  public SaveChanges(): Result {
    let result = new Result();

    this.GetUnsavedElements().slice().forEach(element => {
      result = result.CombineWith(this.itemIsValid(element));
    });

    this.GetUnpurgedElements().slice().forEach(element => {
      result = result.CombineWith(this.itemIsValid(element));
    });

    if (result.IsSuccess) {
      this.persister.Persist(this);
      this.setSavedData();
    }

    return result;
  }

  /**
   * Override for default push that enforces validation
   */
  public push(...items: T[]): number {
    let result = new Result();

    items.forEach(element => {
      result = result.CombineWith(this.itemIsValid(element));
    });

    if (result.IsSuccess) {
      super.push(...items);
      return items.length;
    } else {
      return 0;
    }
  }

  /**
   * Calls the underlying persister's "Purge" method deleting any data previously persisted
   */
  public PurgeData(): void {
    this.persister.Purge();
    this.splice(0, this.length);
  }

  /**
   * Returns a collection of elements that have not been saved
   */
  public GetUnsavedElements(): Queryable<T> {
    return Queryable.From(this.filter(i => this.savedData.raw.indexOf(JSON.stringify(i)) < 0));
  }

  /**
   * Returns a collection of elements that have not been removed from persistence
   */
  public GetUnpurgedElements(): Queryable<T> {
    return Queryable.From(this.savedData.referential).Except(this);
  }

  private getSerializedInstancesFromInitialData(initialData: Array<any>): Queryable<T> {
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

    return Queryable.From(classInstances);
  }

  private itemIsValid(item: T): Result {
    return this.validator.Validate(item);
  }

  private setSavedData(): void {
    this.savedData = {
      raw: JSON.stringify(this),
      referential: this.slice()
    };
  }
}
