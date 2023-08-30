/**
 * @jest-environment jsdom
 */

/* eslint-disable max-lines */
import { Repository } from '../Repository';
import { DomStoragePersister } from '../Persisters/DomStoragePersister';
import { JsonSerializer } from '../../../Utility/Serialization/JsonSerializer';
import { Validator } from '../../../Patterns/Validator/Validator';
import { IValidation } from '../../../Patterns/Validator/IValidation';
import { Result } from '../../../Patterns/Result/Result';
import { Strings } from '../../../System/Strings';

class Person {
  constructor(
    public name = 'name',
    public age = 30
  ) { }
  public complain(): string {
    return 'woe is me';
  }
}

const john = new Person();
john.name = 'John Doe';

class StringValidator implements IValidation<string> {
  public Validate(object: string): Result<null> {
    const result = new Result(null);
    if (!object || object.length < 1) {
      result.ErrorMessages.push('String is not valid');
    }
    return result;
  }
}

describe('Repository', () => {
  let classUnderTest: Repository<any>;

  beforeEach(() => {
    classUnderTest = Repository.New<string>(
      new DomStoragePersister('test', 'local'),
      new Validator([new StringValidator()])
    );
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should get a collection of unsaved elements', () => {
    classUnderTest.splice(0, classUnderTest.length);
    classUnderTest.push(['fake', 'mock']);
    classUnderTest.SaveChanges();
    classUnderTest.push('stub');
    expect(classUnderTest.GetUnsavedElements().every(item => item === 'stub')).toBeTruthy();
  });

  it('should get a collection of unpurged elements', () => {
    classUnderTest.push('fake', 'fake2');
    classUnderTest.SaveChanges();
    classUnderTest.splice(classUnderTest.indexOf('fake'), 1);
    expect(classUnderTest.GetUnpurgedElements().every(item => item === 'fake')).toBeTruthy();
  });

  it('should get pending changes', () => {
    classUnderTest.push('fake1', 'fake2', 'fake3');
    classUnderTest.SaveChanges();
    classUnderTest.push('fake4');
    classUnderTest.splice(classUnderTest.indexOf('fake1'), 1);

    const pendingChanges = classUnderTest.PendingChanges;

    expect(pendingChanges.PendingDeletion.every(item => item === 'fake1'));
    expect(pendingChanges.PendingSave.every(item => item === 'fake4'));
  });

  it('should return 0 on push if item is not valid', () => {
    const result = classUnderTest.push(Strings.Empty);
    expect(result).toEqual(0);
  });


  it('should validate unsaved items before saving changes', () => {
    classUnderTest = Repository.New<string>(
      new DomStoragePersister('test', 'local'),
      new Validator([new StringValidator()])
    );
    classUnderTest.push('fake', 'test');
    classUnderTest[0] = Strings.Empty;

    const result = classUnderTest.SaveChanges();

    expect(result.IsSuccess).toBeFalsy();
  });

  //#region Integration tests using DomStorageAPI
  it('should delete items from persisted storage', () => {
    classUnderTest.push('delete this');
    classUnderTest.SaveChanges();
    classUnderTest.PurgeData();
    expect(classUnderTest.length).toEqual(0);
  });

  it('should persist data through a persister - local', () => {
    // add data
    const db = classUnderTest;
    db.push('Test 1');
    db.push('Test 2');
    db.push('Test 3');
    db.push('Test 4');
    db.SaveChanges();
    // verify new instance with same config has data
    const dupRepo = Repository.New<string>(
      new DomStoragePersister('test', 'local')
    );
    expect(dupRepo.length).toEqual(4);
    dupRepo.PurgeData();
  });

  it('should persist data through a persister - session', () => {
    // add data
    classUnderTest = Repository.New<string>(
      new DomStoragePersister('test', 'session')
    );
    const db = classUnderTest;
    db.push('Test 1');
    db.push('Test 2');
    db.push('Test 3');
    db.push('Test 4');
    db.SaveChanges();
    // verify new instance with same config has data
    const dupRepo = Repository.New<string>(
      new DomStoragePersister('test', 'session')
    );
    expect(dupRepo.length).toEqual(4);
    db.PurgeData();
    dupRepo.PurgeData();
  });

  it('should initialize with serialized classes if serializer and template constructor given', () => {
    classUnderTest = Repository.New<Person>(
      new DomStoragePersister('test', 'session'),
      new Validator([]),
      new JsonSerializer(),
      Person
    );

    const db = classUnderTest;
    db.push(new Person('Bob', 20));
    db.push(new Person('Jane', 30));
    db.push(new Person('Bill', 40));
    db.SaveChanges();

    const dupRepo = Repository.New(
      new DomStoragePersister('test', 'session'),
      new Validator([]),
      new JsonSerializer(),
      Person
    );

    dupRepo.forEach(item => expect((item as Person).complain()).toEqual('woe is me'));
    db.PurgeData();
    dupRepo.PurgeData();
  });
  //#endregion
});
