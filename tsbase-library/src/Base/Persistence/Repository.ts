import { List } from '../Collections/List';
import { IPersistable } from './IPersistable';

export class Repository<T> {
  public Data: List<T>;

  constructor(
    private persister: IPersistable
  ) {
    const initialData = persister.Retrieve();
    this.Data = initialData && initialData.Count >= 1 ? initialData : new List<T>();
  }

  public Save(): void {
    this.persister.Persist(this.Data);
  }

  public PurgeData(): void {
    this.persister.Purge();
    this.Data.Clear();
  }
}