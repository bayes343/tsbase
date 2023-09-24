/**
 * Data structure containing the subject (T) of the search as well as a "qualifier" function for further constraining results
 */
export type SearchResult<T> = {
  item: T,
  qualifier: (query: string) => boolean
};

/**
 * Function which generates indexes or queries from data (D) and their corresponding results (T)
 */
export type Indexer<D, T> = (d: D) => [string, SearchResult<T>][];

/**
 * A collection where all representations (T) of data (D) are indexed upon insertion for efficient querying based on given configuration
 * Use cases include:
 * - Search feature which returns relevant results with the option to support "autocomplete" functionality
 * - Answering potentially complex but predictable questions based on parameters of an "indexer" function
 */
export interface ISearchIndex<T> {
  /**
   * Insert elements into the index <string, T> using the given indexer function
   * @param data
   * @param indexer
   */
  Insert<D>(data: D[], indexer: Indexer<D, T>): Promise<void>;
  /**
   * Return the best match indexes for a given query (consider for an autocomplete feature)
   * @param query
   * @param limit
   */
  GetIndexesForQuery(query: string, limit?: number): Promise<string[]>;
  /**
   * Return the best results for a given query
   * @param query
   * @param limit
   */
  Search(query: string, limit?: number): Promise<T[]>;
  /**
   * Return the best match (equivalent to using the top result from a search)
   * @param query
   */
  Answer(query: string): Promise<T | null>;
  /**
   * Deletes all indexed data
   */
  Reset(): void;
}
