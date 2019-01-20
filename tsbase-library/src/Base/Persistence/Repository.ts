import { List } from '../Collections/List';
import { IPersistable } from './IPersistable';

export class Repository<T> {
  public data: List<T>;

  constructor(
    private persister: IPersistable
  ) {
    const initialData = persister.Retrieve();
    this.data = initialData && initialData.Count >= 1 ? initialData : new List<T>();
  }

  public Save(): void {
    this.persister.Persist(this.data);
  }

  public PurgeData(): void {
    this.persister.Purge();
    this.data.Clear();
  }
}