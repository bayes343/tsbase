import { Any, Mock } from 'tsmockit';
import { IIndexedDb } from '../IIndexedDb';
import { IndexedDb } from '../IndexedDb';

describe('IndexedDb', () => {
  const name = 'testDb';
  const storeName = 'customers';
  const version = 1;
  type Customer = { ssn: string, name: string, age: number, email: string };
  const customerData: Customer[] = [
    { ssn: '444-44-4444', name: 'Bill', age: 35, email: 'bill@company.com' },
    { ssn: '555-55-5555', name: 'Donna', age: 32, email: 'donna@home.org' }
  ];
  const mockIndexedDbFactory = new Mock<typeof indexedDB>();
  let classUnderTest: IIndexedDb;

  const getBill = async () => await classUnderTest.Get<Customer>(storeName, customerData[0].ssn);
  const queryDonna = async () => await classUnderTest.Get<Customer>(storeName, (customer) => customer.name === 'Donna');

  beforeAll(() => {
    const fakeDb = {};
    class FakeOpenRequest {
      result = fakeDb;
      set onsuccess(func: () => void) {
        func();
      }
    };
    const fakeOpenRequest = new FakeOpenRequest();

    mockIndexedDbFactory.Setup(f => f.open(Any<string>(), Any<number>()), fakeOpenRequest);

    classUnderTest = IndexedDb.Instance(
      name,
      version,
      [
        {
          version: version,
          command: (db) => {
            const store = db.createObjectStore(storeName, { keyPath: 'ssn' });
            store.createIndex('name', 'name', { unique: false });
            store.createIndex('email', 'email', { unique: true });
          }
        },
        {
          version: version + 1,
          command: (_db) => { }
        }
      ],
      mockIndexedDbFactory.Object);
  });

  afterAll(() => {
    classUnderTest.Disconnect();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it.only('should connect', async () => {
    const connectResult1 = await classUnderTest.Connect();
    const connectResult2 = await classUnderTest.Connect();

    expect(connectResult1.IsSuccess).toBeTruthy();
    expect(connectResult2.IsSuccess).toBeTruthy();
    expect(connectResult1.Value).toBe(connectResult2.Value);
  });

  it('should disconnect', async () => {
    classUnderTest.Disconnect();
    classUnderTest.Disconnect();
    expect(classUnderTest.Connected).toBeFalsy();

    await classUnderTest.Connect();
  });

  it('should insert data', async () => {
    const result = await classUnderTest.Insert({ customers: customerData });
    expect(result.IsSuccess).toBeTruthy();
  });

  it('should get all records in a store', async () => {
    const result = await classUnderTest.GetAll<Customer>(storeName);
    expect(result.IsSuccess).toBeTruthy();
    expect(result.Value?.length).toEqual(2);
  });

  it('should get a record by key', async () => {
    const billResult = await getBill();

    expect(billResult.IsSuccess).toBeTruthy();
    expect(billResult.Value?.name).toEqual('Bill');
  });

  it('should get records by query', async () => {
    const donnaResult = await queryDonna();
    expect(donnaResult.Value?.[0].name).toEqual('Donna');
  });

  it('should return an empty array if query has no results', async () => {
    const emptyQuery = await classUnderTest.Get<Customer>(storeName, c => c.age === 100);

    expect(emptyQuery.IsSuccess).toBeTruthy();
    expect(emptyQuery.Value?.length).toEqual(0);
  });

  it('should delete a record', async () => {
    const deleteBillResult = await classUnderTest.Delete({ customers: [customerData[0].ssn] });
    const secondBillResult = await getBill();

    expect(deleteBillResult.IsSuccess).toBeTruthy();
    expect(secondBillResult.Value).toBeNull();
  });

  it('should update a record', async () => {
    customerData[1].age = 21;
    const updateDonnaResult = await classUnderTest.Update({ 'customers': [customerData[1]] });
    expect(updateDonnaResult.IsSuccess).toBeTruthy();

    const donnaResult = await queryDonna();
    expect(donnaResult.Value?.[0].age).toEqual(21);
  });
});
