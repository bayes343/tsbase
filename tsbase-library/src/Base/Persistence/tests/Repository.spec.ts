import { Repository } from "../Repository";
import { WebStoragePersister } from '../WebStoragePersister';

describe('Repository', () => {
  let classUnderTest: Repository<string>;

  beforeEach(() => {
    classUnderTest = new Repository<string>(
      new WebStoragePersister('test', 'local')
    );
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  //#region Integeation tests using DomStorageAPI
  it('should delete items from persisted storage', () => {
    classUnderTest.Add("delete this");
    classUnderTest.SaveChanges();
    classUnderTest.PurgeData();
    expect(classUnderTest.Count).toEqual(0);
  });

  it('should persist data through a persister - local', () => {
    // add data
    const db = classUnderTest;
    db.Add('Test 1');
    db.Add('Test 2');
    db.Add('Test 3');
    db.Add('Test 4');
    db.SaveChanges();
    // verify new instance with same config has data
    const dupRepo = new Repository<string>(
      new WebStoragePersister('test', 'local')
    );
    expect(dupRepo.Count).toEqual(4);
    dupRepo.PurgeData();
  });

  it('should persist data through a persister - session', () => {
    // add data
    classUnderTest = new Repository<string>(
      new WebStoragePersister('test', 'session')
    );
    const db = classUnderTest;
    db.Add('Test 1');
    db.Add('Test 2');
    db.Add('Test 3');
    db.Add('Test 4');
    classUnderTest.SaveChanges();
    // verify new instance with same config has data
    const dupRepo = new Repository<string>(
      new WebStoragePersister('test', 'session')
    );
    expect(dupRepo.Count).toEqual(4);
    dupRepo.PurgeData();
  });
  //#endregion
});