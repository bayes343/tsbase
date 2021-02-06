import { EventStore, IEventStore } from '../module';

enum StatePaths { One = 'one' }

describe('EventStore', () => {
  let classUnderTest: IEventStore;

  beforeEach(() => {
    classUnderTest = new EventStore();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should get state when the store is empty', () => {
    const state = classUnderTest.GetState();

    expect(state).toBeDefined();
    expect(Object.keys(state).length).toEqual(0);
  });

  it('should get state when the store is not empty', () => {
    classUnderTest.SetStateAt('test', StatePaths.One);

    const state = classUnderTest.GetState();

    expect(state).toBeDefined();
    expect(Object.keys.length).toEqual(1);
  });

  it('should return undefined when getting state at an empty path', () => {
    expect(classUnderTest.GetStateAt(StatePaths.One)).toBeUndefined();
  });

  it('should get state at a path with a current value', () => {
    classUnderTest.SetStateAt('test', StatePaths.One);
    const stateAtPath = classUnderTest.GetStateAt(StatePaths.One);
    expect(stateAtPath).toBeDefined();
  });

  it('should set state at a given path', () => {
    const newState = 'newState';
    const setState = classUnderTest.SetStateAt(newState, StatePaths.One);
    expect(setState).toEqual(newState);
  });

  it('should get an observable at an empty path', () => {
    expect(classUnderTest.ObservableAt).toBeDefined();
  });

  it('should get an observable at a path with entries', () => {
    classUnderTest.SetStateAt('test', StatePaths.One);
    expect(classUnderTest.ObservableAt).toBeDefined();
  });

  it('should get an empty ledger', () => {
    expect(classUnderTest.GetLedger().length).toEqual(0);
  });

  it('should get a ledger with entries', () => {
    classUnderTest.SetStateAt('one', StatePaths.One);
    classUnderTest.SetStateAt('two', StatePaths.One);
    classUnderTest.SetStateAt('three', StatePaths.One);

    expect(classUnderTest.GetLedger().length).toEqual(3);
  });

  it('should maintain state of complex objects', () => {
    type Member = { name: string, gender: 'male' | 'female', age: number };
    type Pet = { name: string, species: 'Cat' | 'Dog' };
    type Family = { father: Member, mother: Member, kids: Member[], pets: Pet[] };
    type House = { family: Family, address: string, yearBuilt: number };
    const house: House = {
      address: '123 some road',
      yearBuilt: 1980,
      family: {
        father: { name: 'Jon Doe', gender: 'male', age: 30 },
        mother: { name: 'Jane Doe', gender: 'female', age: 25 },
        kids: [
          { name: 'Jason Doe', gender: 'male', age: 10 },
          { name: 'Julie Doe', gender: 'female', age: 6 }
        ],
        pets: []
      }
    };
    enum Paths { Root = '', Family = 'family', Father = 'family.father', Pets = 'family.pets' }
    const updatedFather: Member = { age: 30, gender: 'male', name: 'John Doe' };
    const updatedPets = [{ name: 'Fido', species: 'Dog' }, { name: 'Whiskers', species: 'Cat' }];

    classUnderTest.SetStateAt(house, Paths.Root);
    expect(JSON.stringify(classUnderTest.GetState())).toEqual(JSON.stringify(house));

    classUnderTest.SetStateAt(updatedFather, Paths.Father);
    classUnderTest.SetStateAt(updatedPets, Paths.Pets);

    expect(classUnderTest.GetLedger().length).toEqual(3);
    expect(JSON.stringify(classUnderTest.GetStateAt(Paths.Father))).toEqual(JSON.stringify(updatedFather));
    expect(JSON.stringify(classUnderTest.GetStateAt(Paths.Pets))).toEqual(JSON.stringify(updatedPets));
  });
});
