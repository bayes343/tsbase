import { List } from '../Collections/List';
import { IPersistable } from './IPersistable';

export class Repository<T> extends List<T> {
  constructor(
    private persister: IPersistable
  ) {
    super();
    const initialData = persister.Retrieve();
    this.Item = initialData && initialData.length >= 1 ? initialData : new Array<T>();
    this.updateProperties();
  }

  public SaveChanges(): void {
    this.persister.Persist(this.Item);
  }

  public PurgeData(): void {
    this.persister.Purge();
    this.Clear();
  }
}