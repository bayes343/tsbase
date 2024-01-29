import { Queryable } from '../../Collections/Queryable/Queryable';
import { Result } from '../../Patterns/Result/Result';
import { Validator } from '../../Patterns/Validator/Validator';
import { Strings } from '../../System/Strings';
import { ISerializer } from '../../Utility/Serialization/ISerializer';
import { IPersister } from './Persisters/IPersister';

/**
 * An extension of Queryable<T> that incorporates persistence functionality
 * provided by a class implementing IPersister.  Previously persisted data is
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

  protected savedData = { raw: Strings.Empty, referential: [] as Array<T> };
  protected persister!: IPersister<T>;
  protected validator: Validator<T> = new Validator<T>([]);
  protected serializer?: ISerializer;
  protected serializeAs?: { new(): T; };

  public static New<T>(
    persister: IPersister<T>,
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
  public SaveChanges(): Result<null> {
    let result = new Result(null);

    this.GetUnsavedElements().slice().forEach(element => {
      result = result.CombineWith(this.itemIsValid(element));
    });

    this.GetUnpurgedElements().slice().forEach(element => {
      result = result.CombineWith(this.itemIsValid(element));
    });

    if (result.IsSuccess) {
      this.persister.Persist(this.slice());
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
    return Queryable.From(this.filter(i => !this.savedData.raw.includes(JSON.stringify(i))));
  }

  /**
   * Returns a collection of elements that have not been removed from persistence
   */
  public GetUnpurgedElements(): Queryable<T> {
    return Queryable.From(this.savedData.referential).Except(this.slice());
  }

  protected getSerializedInstancesFromInitialData(initialData: Array<any>): Queryable<T> {
    const classInstances = new Array<T>();

    initialData.forEach(element => {
      classInstances.push((this.serializer as ISerializer)
        .Deserialize((this.serializeAs as { new(): T; }), element));
    });

    return Queryable.From(classInstances);
  }

  protected itemIsValid(item: T): Result<null> {
    return this.validator.Validate(item);
  }

  protected setSavedData(): void {
    this.savedData = {
      raw: JSON.stringify(this.slice()),
      referential: this.slice()
    };
  }
}
