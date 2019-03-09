import { Repository } from "../Repository";
import { WebStoragePersister } from '../WebStoragePersister';
import { JsonSerializer } from '../../Utility/Serialization/JsonSerializer';

class Person {
  constructor(
    public name = 'John Doe',
    public age = 30
  ) { }
  public complain(): string {
    return 'woe is me';
  }
}

describe('Repository', () => {
  let classUnderTest: Repository<any>;

  beforeEach(() => {
    classUnderTest = new Repository<string>(
      new WebStoragePersister('test', 'local')
    );
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should get a collection of unsaved elements when requested', () => {
    classUnderTest.AddRange(['fake', 'mock']);
    classUnderTest.SaveChanges();
    classUnderTest.Add('stub');
    expect(classUnderTest.GetUnsavedElements().All(item => item === 'stub')).toBeTruthy();
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
    db.SaveChanges();
    // verify new instance with same config has data
    const dupRepo = new Repository<string>(
      new WebStoragePersister('test', 'session')
    );
    expect(dupRepo.Count).toEqual(4);
    db.PurgeData();
    dupRepo.PurgeData();
  });

  it('should initialize with serialized classes if serializer and template constructor given', () => {
    classUnderTest = new Repository<Person>(
      new WebStoragePersister('test', 'session'),
      new JsonSerializer<Person>(),
      Person
    );

    const db = classUnderTest;
    db.Add(new Person('Bob', 20));
    db.Add(new Person('Jane', 30));
    db.Add(new Person('Bill', 40));
    db.SaveChanges();

    const dupRepo = new Repository(
      new WebStoragePersister('test', 'session'),
      new JsonSerializer<Person>(),
      Person
    );

    dupRepo.ForEach(item => expect(item.complain()).toEqual('woe is me'));
    db.PurgeData();
    dupRepo.PurgeData();
  });
  //#endregion
});