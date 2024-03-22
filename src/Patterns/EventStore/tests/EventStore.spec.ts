/* eslint-disable max-lines */
import { EventStore, IEventStore, NoTransactionToRedo, NoTransactionToUndo, StateChangeUnnecessary } from '../module';

describe('EventStore', () => {
  let classUnderTest: IEventStore<Partial<{
    one: string,
    two: string,
    three: string,
    dynamic: Record<string, string>,
    zero: 0,
    empty: '',
    null: null
  }>>;
  let scenarioUnderTest: IEventStore<House>;

  beforeEach(() => {
    classUnderTest = new EventStore({});
    scenarioUnderTest = new EventStore({});
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
    classUnderTest.SetState(s => s.one, 'test');

    const state = classUnderTest.GetState();

    expect(state).toEqual({
      one: 'test'
    });
  });

  it('should return undefined when getting state at an undefined member', () => {
    expect(classUnderTest.GetState(s => s.one)).toBeUndefined();
  });

  it('should get state for a member with a current value', () => {
    classUnderTest.SetState(s => s.one, 'test');
    const stateAtPath = classUnderTest.GetState(s => s.one);
    expect(stateAtPath).toEqual('test');
  });

  it('should set state for a given member', () => {
    const newState = 'newState';
    const setState = classUnderTest.SetState(s => s.one, newState);
    expect(setState.Value).toEqual(newState);
  });

  it('should get an observable for a given undefined member', () => {
    const obs1 = classUnderTest.ObservableAt(s => s.one);
    const obs2 = classUnderTest.ObservableAt(s => s.one);

    expect(obs1).toBeDefined();
    expect(obs2).toBeDefined();
    expect(obs1).toBe(obs2);
  });

  it('should get an observable five a given defined member', () => {
    classUnderTest.SetState(s => s.one, 'test');
    expect(classUnderTest.ObservableAt).toBeDefined();
  });

  it('should get an empty ledger', () => {
    expect(classUnderTest.GetLedger().length).toEqual(0);
  });

  it('should get a ledger with entries', () => {
    classUnderTest.SetState(s => s.one, 'one');
    classUnderTest.SetState(s => s.two, 'two');
    classUnderTest.SetState(s => s.three, 'three');

    expect(classUnderTest.GetLedger().length).toEqual(3);
  });

  it('should only update the state when the state being updated changed', () => {
    const changeResult = classUnderTest.SetState(s => s.one, 'one');
    const noChangeResult = classUnderTest.SetState(s => s.one, 'one');

    expect(changeResult.IsSuccess).toBeTruthy();
    expect(noChangeResult.IsSuccess).toBeFalsy();
    expect(noChangeResult.ErrorMessages).toContain(StateChangeUnnecessary);
  });

  it('should return a failed result for an undo when there is no state to undo', () => {
    const result = classUnderTest.Undo();
    expect(result.IsSuccess).toBeFalsy();
    expect(result.ErrorMessages).toContain(NoTransactionToUndo);
  });

  it('should undo state change(s)', () => {
    let rootUpdate: any = undefined;
    classUnderTest.ObservableAt().Subscribe(u => rootUpdate = u);
    const stateAtOne = () => classUnderTest.GetState(s => s.one);
    classUnderTest.SetState(s => s.one, 'one');
    classUnderTest.SetState(s => s.one, 'two');
    expect(stateAtOne()).toEqual('two');

    classUnderTest.Undo();
    expect(stateAtOne()).toEqual('one');

    classUnderTest.Undo();
    expect(stateAtOne()).toBeUndefined();
    expect(classUnderTest.GetState()).toEqual({});
    expect(rootUpdate).toEqual({});
  });

  it('should return a failed result for an redo when there is no state to redo', () => {
    const result = classUnderTest.Redo();
    expect(result.IsSuccess).toBeFalsy();
    expect(result.ErrorMessages).toContain(NoTransactionToRedo);
  });

  it('should redo a state change that was voided (via undo)', () => {
    const stateAtOne = () => classUnderTest.GetState(s => s.one);
    classUnderTest.SetState(s => s.one, 'one');
    classUnderTest.SetState(s => s.one, 'two');
    expect(stateAtOne()).toEqual('two');
    expect(classUnderTest.GetLedger().length).toEqual(2);
    classUnderTest.Undo();
    classUnderTest.Undo();

    classUnderTest.Redo();
    expect(stateAtOne()).toEqual('one');

    classUnderTest.Redo();
    expect(stateAtOne()).toEqual('two');
  });

  it('should only allow redos up to the last non-voided transaction', () => {
    const stateAtOne = () => classUnderTest.GetState(s => s.one);
    classUnderTest.SetState(s => s.one, 'one');
    classUnderTest.SetState(s => s.one, 'two');
    expect(stateAtOne()).toEqual('two');
    expect(classUnderTest.GetLedger().length).toEqual(2);
    classUnderTest.Undo();
    classUnderTest.Undo();
    classUnderTest.SetState(s => s.one, 'three');

    const result = classUnderTest.Redo();

    expect(classUnderTest.GetState(s => s.one)).toEqual('three');
    expect(result.IsSuccess).toBeFalsy();
    expect(result.ErrorMessages).toContain(NoTransactionToRedo);
  });

  it('should return the entire state when the root is requested via GetStateAt', () => {
    const oneState = 'one';
    classUnderTest.SetState(s => s.one, oneState);
    const expected = JSON.stringify({ one: oneState });

    const actual = JSON.stringify(classUnderTest.GetState());

    expect(actual).toEqual(expected);
  });

  it('should get state using dynamic strings', () => {
    classUnderTest.SetState(s => s.dynamic?.test, 'one');
    expect(classUnderTest.GetState('dynamic.test')).toEqual('one');
  });

  it('should set state using dynamic strings', () => {
    classUnderTest.SetState('dynamic.test', 'two');
    expect(classUnderTest.GetState(s => s.dynamic?.test)).toEqual('two');
  });

  it('should set a key in the store with the value 0', () => {
    classUnderTest.SetState('zero', 0);
    expect(classUnderTest.GetState()).toEqual({ zero: 0 });
  });

  it('should set a key in the store with the value of an empty string', () => {
    classUnderTest.SetState('empty', '');
    expect(classUnderTest.GetState()).toEqual({ empty: '' });
  });

  it('should set a key in the store with the value of null', () => {
    classUnderTest.SetState(s => s.null, null);
    expect(classUnderTest.GetState()).toEqual({ null: null });
  });

  /* ========================= Scenario Tests ========================= */
  type Member = { name: string, gender: 'male' | 'female', age: number };
  type Pet = { name: string, species: 'Cat' | 'Dog' };
  type Family = { father: Member, mother: Member, kids: Member[], pets: Pet[] };
  type House = Partial<{ family: Family, address: string, yearBuilt: number }>;

  const house = (): House => {
    return {
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
  };
  const updatedFather: Member = { age: 31, gender: 'male', name: 'John Doe' };
  const updatedPets = [{ name: 'Fido', species: 'Dog' }, { name: 'Whiskers', species: 'Cat' }];


  it('should maintain a transaction ledger of state changing events', () => {
    scenarioUnderTest.SetState(house());
    scenarioUnderTest.SetState(s => s.family?.father, updatedFather);
    scenarioUnderTest.SetState(s => s.family?.pets, updatedPets);

    expect(scenarioUnderTest.GetLedger().length).toEqual(3);
  });

  it('should set and get state with nested objects', () => {
    scenarioUnderTest.SetState(house());
    expect(JSON.stringify(scenarioUnderTest.GetState())).toEqual(JSON.stringify((house())));

    scenarioUnderTest.SetState(s => s.family?.father, updatedFather);
    scenarioUnderTest.SetState(s => s.family?.pets, updatedPets);

    expect(scenarioUnderTest.GetLedger().length).toEqual(3);
    expect(scenarioUnderTest.GetState(s => s.family?.father)?.age).toEqual(updatedFather.age);
    expect(JSON.stringify(scenarioUnderTest.GetState(s => s.family?.pets))).toEqual(JSON.stringify(updatedPets));
  });

  it('should return a cloned object which does not affect the event store if mutated', () => {
    const clonedState = scenarioUnderTest.SetState(house()).Value as House;
    clonedState.address = 'test';
    expect((scenarioUnderTest.GetState() as House).address).toEqual('123 some road');
  });

  it('should notify parents of updates to children', () => {
    let rootUpdates = 0;
    let familyUpdates = 0;
    scenarioUnderTest.ObservableAt().Subscribe(() => rootUpdates++);
    scenarioUnderTest.ObservableAt(s => s.family).Subscribe(() => familyUpdates++);

    scenarioUnderTest.SetState(s => s.family?.father, updatedFather);

    expect(rootUpdates).toEqual(1);
    expect(familyUpdates).toEqual(1);
  });

  it('should not notify siblings of updates to peers', () => {
    let petsUpdates = 0;
    scenarioUnderTest.ObservableAt(s => s.family?.pets).Subscribe(() => petsUpdates++);

    scenarioUnderTest.SetState(s => s.family?.father, updatedFather);

    expect(petsUpdates).toEqual(0);
  });

  it('should notify children of updates to parents', () => {
    let fatherUpdates = 0;
    let petsUpdates = 0;
    scenarioUnderTest.ObservableAt(s => s.family?.father).Subscribe(() => fatherUpdates++);
    scenarioUnderTest.ObservableAt(s => s.family?.pets).Subscribe(() => petsUpdates++);

    scenarioUnderTest.SetState(s => s.family, house().family);

    expect(fatherUpdates).toEqual(1);
    expect(petsUpdates).toEqual(1);
  });

  it('should publish to children and parents with appropriate state', () => {
    let fatherUpdateState: any = {};
    let petsUpdateState: any = {};
    scenarioUnderTest.ObservableAt(s => s.family?.father).Subscribe(state => fatherUpdateState = state);
    scenarioUnderTest.ObservableAt(s => s.family?.pets).Subscribe(state => petsUpdateState = state);

    scenarioUnderTest.SetState(house());
    scenarioUnderTest.SetState(s => s.family?.father, updatedFather);
    scenarioUnderTest.SetState(s => s.family?.pets, updatedPets);

    expect(JSON.stringify(fatherUpdateState)).toEqual(JSON.stringify(updatedFather));
    expect(JSON.stringify(petsUpdateState)).toEqual(JSON.stringify(updatedPets));
    expect((scenarioUnderTest.GetState() as House).address).toEqual(house().address);
    expect((scenarioUnderTest.GetState() as House).yearBuilt).toEqual(house().yearBuilt);
  });
});
