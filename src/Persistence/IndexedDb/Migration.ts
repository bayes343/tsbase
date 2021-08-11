export type Migration = {
  version: number,
  command: ((db: IDBDatabase) => void)
};
