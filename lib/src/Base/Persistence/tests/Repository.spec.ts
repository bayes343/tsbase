import { Repository } from "../Repository";
import { WebStoragePersister } from '../WebStoragePersister';
import { JsonSerializer } from '../../Utility/Serialization/JsonSerializer';
import { Rule } from '../Integrity/Rule';
import { Severity } from '../Integrity/Severity';
import { List } from '../../Collections/List';

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

  it('should allow elements that comply with rules to be added to the repository', () => {
    classUnderTest.Clear();
    classUnderTest.Rules.push(
      new Rule<number>(item => item < 10, Severity.Error, 'Items must be less than 10')
    );
    classUnderTest.AddRange([1, 2, 3, 4, 5]);
    classUnderTest.Add(9);
    expect(classUnderTest.Count).toEqual(6);
  });

  it('should not allow elements that dont comply with rules to be added to the repository and log an error if the severity is error', () => {
    classUnderTest.Clear();
    classUnderTest.Rules.push(
      new Rule<number>(item => item < 10, Severity.Error, 'Items must be less than 10')
    );
    classUnderTest.AddRange([1, 2, 3, 4, 5]);
    classUnderTest.Add(10);
    expect(classUnderTest.Count).toEqual(5);
  });

  it('should allow elements to be inserted and log a warning when they do not comply with rules but the severity is warning', () => {
    classUnderTest.Clear();
    classUnderTest.Rules.push(
      new Rule<number>(item => item < 5, Severity.Warning, 'We recommend numbers less than 5')
    );
    classUnderTest.InsertRange(0, new List<number>([1, 2, 3, 4]));
    classUnderTest.Insert(2, 5);
    expect(classUnderTest.Count).toEqual(5);
  });

  it('should allow elements to be inserted and log an info message when they do not comply with rules but the severity is info', () => {
    classUnderTest.Clear();
    classUnderTest.Rules.push(
      new Rule<number>(item => item < 5, Severity.Info, 'You inserted a number greater than 5')
    );
    classUnderTest.InsertRange(0, new List<number>([1, 2, 3, 4]));
    classUnderTest.Insert(2, 9);
    expect(classUnderTest.Count).toEqual(5);
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