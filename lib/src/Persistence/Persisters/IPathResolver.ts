export interface IPathResolver {
  resolve(...pathSegments: string[]): string;
}
