/**
 * An interface that defines FSPersister required methods on the node fs library
 */
export interface IFileSystemAdapter {
  constants: { W_OK: any };
  writeFileSync(path: string, data: any): void;
  existsSync(path: string): boolean;
  mkdirSync(path: string): void;
  accessSync(path: string, mode: number): void;
  readFileSync(path: string, options?: any): Buffer;
}
