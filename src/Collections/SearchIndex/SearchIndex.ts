import { Queryable } from '../Queryable';
import { ISearchIndex, SearchResult, Indexer } from './ISearchIndex';

export class SearchIndex<T> implements ISearchIndex<T> {
  private index: Record<string, SearchResult<T>[]> = {};

  public async Insert<D>(items: D[], indexer: Indexer<D, T>): Promise<void> {
    items.forEach(item => {
      const entries = indexer(item);
      entries.forEach(entry => {
        this.index[entry[0]] = !!this.index[entry[0]] ?
          this.index[entry[0]].concat([entry[1]]) : [entry[1]];
      });
    });
  }

  public async GetIndexesForQuery(query: string, limit = 10): Promise<string[]> {
    return Queryable.From(Object.keys(this.index)).Search(query).slice(0, limit);
  }

  public async Search(query: string, limit = 10): Promise<T[]> {
    const matchingIndexes = Queryable.From(Object.keys(this.index)).Search(query);
    let results: T[] = [];
    matchingIndexes.forEach(i => {
      const qualifiedResults = this.index[i].filter(e => e.qualifier(query));
      results = results.concat(qualifiedResults.map(r => r.item));
    });
    return Queryable.From(results).Distinct().slice(0, limit);
  }

  public async Answer(query: string): Promise<T | null> {
    const results = await this.Search(query, 1);
    return results[0] || null;
  }

  public Reset(): void {
    this.index = {};
  }
}
