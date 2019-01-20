import { Repository } from "../Repository";
import { DomStoragePersister } from '../DomStoragePersister';

describe('Repository', () => {
  let classUnderTest: Repository<string>;

  beforeEach(() => {
    classUnderTest = new Repository<string>(
      new DomStoragePersister('test', 'local')
    );
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  //#region Integeation tests using DomStorageAPI
  it('should delete items from persisted storage', () => {
    const db = classUnderTest.data;
    db.Add("delete this");
    classUnderTest.Save();
    classUnderTest.PurgeData();
    expect(db.Count).toEqual(0);
  });

  it('should persist data through a persister - local', () => {
    // add data
    const db = classUnderTest.data;
    db.Add('Test 1');
    db.Add('Test 2');
    db.Add('Test 3');
    db.Add('Test 4');
    classUnderTest.Save();
    // verify new instance with same config has data
    const dupRepo = new Repository<string>(
      new DomStoragePersister('test', 'local')
    );
    expect(dupRepo.data.Count).toEqual(4);
    dupRepo.PurgeData();
  });

  it('should persist data through a persister - session', () => {
    // add data
    classUnderTest = new Repository<string>(
      new DomStoragePersister('test', 'session')
    );
    const db = classUnderTest.data;
    db.Add('Test 1');
    db.Add('Test 2');
    db.Add('Test 3');
    db.Add('Test 4');
    classUnderTest.Save();
    // verify new instance with same config has data
    const dupRepo = new Repository<string>(
      new DomStoragePersister('test', 'session')
    );
    expect(dupRepo.data.Count).toEqual(4);
    dupRepo.PurgeData();
  });
  //#endregion
});