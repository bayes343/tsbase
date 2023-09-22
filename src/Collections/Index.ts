import { Queryable } from './Queryable';

export type Qualifier = (query: string) => boolean;
export type SearchResult<T> = {
  item: T,
  qualifier: Qualifier
};
export type Indexer<D, T> = (d: D) => [string, SearchResult<T>][];

export interface IIndex<T> {
  Insert<D>(data: D[], indexer: Indexer<D, T>): Promise<void>;
  AutoComplete(query: string, limit?: number): Promise<string[]>;
  Search(query: string, limit?: number): Promise<T[]>;
  Reset(): void;
}

export class Index<T> implements IIndex<T> {
  private index: Record<string, SearchResult<T>[]> = {};

  async Insert<D>(items: D[], indexer: Indexer<D, T>): Promise<void> {
    items.forEach(item => {
      const entries = indexer(item);
      entries.forEach(entry => {
        this.index[entry[0]] = !!this.index[entry[0]] ?
          this.index[entry[0]].concat([entry[1]]) : [entry[1]];
      });
    });
  }

  async AutoComplete(query: string, limit = 10): Promise<string[]> {
    return Queryable.From(Object.keys(this.index)).Search(query).slice(0, limit);
  }

  async Search(query: string, limit = 10): Promise<T[]> {
    const matchingIndexes = Queryable.From(Object.keys(this.index)).Search(query);
    let results: T[] = [];
    matchingIndexes.forEach(i => {
      const qualifiedResults = this.index[i].filter(e => e.qualifier(query));
      results = results.concat(qualifiedResults.map(r => r.item));
    });
    return Queryable.From(results).Distinct().slice(0, limit);
  }

  Reset(): void {
    this.index = {};
  }
}
