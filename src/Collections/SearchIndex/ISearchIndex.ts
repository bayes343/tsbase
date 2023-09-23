export type Qualifier = (query: string) => boolean;
export type SearchResult<T> = {
  item: T,
  qualifier: Qualifier
};
export type Indexer<D, T> = (d: D) => [string, SearchResult<T>][];

export interface ISearchIndex<T> {
  Insert<D>(data: D[], indexer: Indexer<D, T>): Promise<void>;
  AutoComplete(query: string, limit?: number): Promise<string[]>;
  Search(query: string, limit?: number): Promise<T[]>;
  Reset(): void;
}
