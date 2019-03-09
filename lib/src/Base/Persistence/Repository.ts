import { List } from '../Collections/List';
import { IPersistable } from './IPersistable';

/**
 * An extension of the List<T> class that incorporates persistence functionality 
 * provided by a class implementing IPersistable.  Previously persisted data is
 * loaded on instantiation using the default persister's "Retrieve" method. 
 */
export class Repository<T> extends List<T> {
  constructor(
    private persister: IPersistable
  ) {
    super();
    const initialData = persister.Retrieve();
    this.Item = initialData && initialData.length >= 1 ? initialData : new Array<T>();
  }

  /**
   * Calls the underlying persister's "Persist" method saving the data currently in the list
   */
  public SaveChanges(): void {
    this.persister.Persist(this.Item);
  }

  /**
   * Calls the underlying persister's "Purge" method deleting any data previously persisted and clearing the list
   */
  public PurgeData(): void {
    this.persister.Purge();
    this.Clear();
  }
}