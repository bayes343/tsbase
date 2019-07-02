import { Repository } from '../Repository';
import { WebStoragePersister } from '../Persisters/WebStoragePersister';
import { JsonSerializer } from '../../Utility/Serialization/JsonSerializer';
import { Validator } from '../../Patterns/Validator/Validator';
import { IValidation } from '../../Patterns/Validator/IValidation';
import { Result } from '../../Patterns/Result/Result';
import { List } from '../../Collections/List';
import { Strings } from '../../Constants/Strings';

class Person {
  constructor(
    public name = 'John Doe',
    public age = 30
  ) { }
  public complain(): string {
    return 'woe is me';
  }
}

class StringValidator implements IValidation<string> {
  public Validate(object: string): Result {
    const result = new Result();
    if (!object || object.length < 1) {
      result.ErrorMessages.push('String is not valid');
    }
    return result;
  }
}

describe('Repository', () => {
  let classUnderTest: Repository<any>;

  beforeEach(() => {
    classUnderTest = new Repository<string>(
      new WebStoragePersister('test', 'local'),
      new Validator([new StringValidator()])
    );
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should get a collection of unsaved elements', () => {
    classUnderTest.AddRange(['fake', 'mock']);
    classUnderTest.SaveChanges();
    classUnderTest.Add('stub');
    expect(classUnderTest.GetUnsavedElements().All(item => item === 'stub')).toBeTruthy();
  });

  it('should get a collection of unpurged elements', () => {
    classUnderTest.AddRange(['fake', 'fake2']);
    classUnderTest.SaveChanges();
    classUnderTest.Remove('fake');
    expect(classUnderTest.GetUnpurgedElements().All(item => item === 'fake')).toBeTruthy();
  });

  it('should get pending changes', () => {
    classUnderTest.Add(['fake1', 'fake2', 'fake3']);
    classUnderTest.SaveChanges();
    classUnderTest.Add('fake4');
    classUnderTest.Remove('fake1');

    const pendingChanges = classUnderTest.PendingChanges;

    expect(pendingChanges.PendingDeletion.All(item => item === 'fake1'));
    expect(pendingChanges.PendingSave.All(item => item === 'fake4'));
  });

  it('should return a failed result on Add if item is not valid', () => {
    const result = classUnderTest.Add(Strings.Empty);
    expect(result.IsSuccess).toBeFalsy();
  });

  it('should return a failed result on AddRange if an item is not valid', () => {
    const result = classUnderTest.AddRange([Strings.Empty, 'fake']);
    expect(result.IsSuccess).toBeFalsy();
  });

  it('should return a failed result on Insert if item is not valid', () => {
    const result = classUnderTest.Insert(0, Strings.Empty);
    expect(result.IsSuccess).toBeFalsy();
  });

  it('should return a failed result on InsertRange if an item is not valid', () => {
    const result = classUnderTest.InsertRange(0, new List([Strings.Empty, 'fake']));
    expect(result.IsSuccess).toBeFalsy();
  });

  it('should successfully Insert an item if it is valid', () => {
    const result = classUnderTest.Insert(0, 'fake');
    expect(result.IsSuccess).toBeTruthy();
  });

  it('should successfully InsertRange if all items are valid', () => {
    const result = classUnderTest.InsertRange(0, new List(['fakest', 'fake']));
    expect(result.IsSuccess).toBeTruthy();
  });

  it('should validate unsaved items before saving changes', () => {
    classUnderTest = new Repository<string>(
      new WebStoragePersister('test', 'local'),
      new Validator([new StringValidator()])
    );
    classUnderTest.AddRange(['fake', 'test']);
    classUnderTest.Item[0] = Strings.Empty;

    const result = classUnderTest.SaveChanges();

    expect(result.IsSuccess).toBeFalsy();
  });

  class AgeValidation implements IValidation<Person> {
    Validate(object: Person): Result {
      const result = new Result();
      if (!object.age || object.age < 0) {
        result.ErrorMessages.push(`Invalid age: ${object.age ? object.age : 'null'}`);
      }
      return result;
    }
  }

  it('should validate unsaved reference type items before saving', () => {
    classUnderTest = new Repository<Person>(
      new WebStoragePersister('test', 'local'),
      new Validator([new AgeValidation()])
    );
    const bill = new Person();
    bill.age = 1;
    const bob = new Person();
    bob.age = 2;
    classUnderTest.AddRange([bill, bob]);
    classUnderTest.SaveChanges();
    bill.age = -1;
    bob.age = null as any;

    const result = classUnderTest.SaveChanges();

    expect(result.ErrorMessages.length).toEqual(2);
  });

  //#region Integration tests using DomStorageAPI
  it('should delete items from persisted storage', () => {
    classUnderTest.Add('delete this');
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
      new Validator([]),
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
      new Validator([]),
      new JsonSerializer<Person>(),
      Person
    );

    dupRepo.ForEach(item => expect((item as Person).complain()).toEqual('woe is me'));
    db.PurgeData();
    dupRepo.PurgeData();
  });
  //#endregion
});
