import { List } from '../Collections/List';
import { IPersistable } from './IPersistable';
import { Enumerable } from '../Collections/Query/Enumerable';
import { ISerializer } from '../Utility/Serialization/ISerializer';

/**
 * An extension of the List<T> class that incorporates persistence functionality 
 * provided by a class implementing IPersistable.  Previously persisted data is
 * loaded on instantiation using the default persister's "Retrieve" method. 
 */
export class Repository<T> extends List<T> {
  private savedData: Array<T>;

  constructor(
    private persister: IPersistable,
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
  public GetUnsavedElements(): Enumerable<T> {
    return this.Except(this.savedData);
  }

  private getSerializedInstancesFromInitialData(initialData: Array<any>): Array<T> {
    const classInstances = new Array<T>();
    initialData.forEach(element => {
      if (this.serializer && this.serializeAs) {
        classInstances.push(this.serializer.Serialize(this.serializeAs, element));
      } else {
        throw new Error('OperationInvalid - cannot attempt serialization without a serializer and a class constructor');
      }
    });
    return classInstances;
  }
}
