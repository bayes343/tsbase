import { IPathResolver } from './IPathResolver';
import { IFileSystemAdapter } from './IFileSystemAdapter';
import { IPersister } from './IPersister';

export class FSPersister implements IPersister {
  private get dir(): string {
    return this.pathResolver.resolve(__dirname, this.localFilesDirectory);
  }
  private get file(): string {
    return this.pathResolver.resolve(__dirname, this.filePath);
  }

  constructor(
    private localFilesDirectory: string,
    private filePath: string,
    private key: string,
    private pathResolver: IPathResolver,
    private fileSystemAdapter: IFileSystemAdapter
  ) {
    this.ensureLocalFilesDirExists();
    this.ensureFileExists();
  }

  public Retrieve(): any[] {
    const json = this.retrieveDataFileJson();
    return json[this.key] ? json[this.key] : [];
  }

  public Persist(items: any[]): void {
    const json = this.retrieveDataFileJson();
    json[this.key] = items;
    this.fileSystemAdapter.writeFileSync(this.file, JSON.stringify(json));
  }

  public Purge(): void {
    this.Persist([]);
  }

  private ensureLocalFilesDirExists() {
    if (!this.fileSystemAdapter.existsSync(this.dir)) {
      this.fileSystemAdapter.mkdirSync(this.dir);
    }
  }

  private ensureFileExists() {
    try {
      this.fileSystemAdapter.accessSync(this.file, this.fileSystemAdapter.constants.W_OK);
    } catch (error) {
      this.writeBlankJsonToFile();
    }
  }

  private writeBlankJsonToFile() {
    const blankJson = {};
    this.fileSystemAdapter.writeFileSync(this.file, JSON.stringify(blankJson));
  }

  private retrieveDataFileJson(): any {
    const fileContents = this.fileSystemAdapter.readFileSync(
      this.pathResolver.resolve(__dirname, this.filePath), 'utf8');

    return JSON.parse(fileContents.toString());
  }

}
