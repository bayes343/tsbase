/**
 * An interface that defines FSPersister required methods on the node path library
 */
export interface IPathResolver {
  resolve(...pathSegments: string[]): string;
}
