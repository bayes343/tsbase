import { IndexedDb } from '../../IndexedDb';
import { customerData, transactionData } from './data';
import { migrations } from './migrations';
import { Customer, StoreNames, Transaction } from './types';

describe('Database Scenario', () => {
  const db = IndexedDb.Instance('scenario', 2, migrations);

  it('should insert data into the stores', async () => {
    const insertionResult = await db.Insert({
      customers: customerData,
      transactions: transactionData
    });

    expect(insertionResult.IsSuccess).toBeTruthy();
  });

  it('should get data out of the stores', async () => {
    const johnDoeResult = await db.Get<Customer>(StoreNames.Customers, customerData[0].id);
    const johnDoesTransactions = await db.Get<Transaction>(StoreNames.Transactions, (t => t.customerId === johnDoeResult.Value?.id));

    expect(johnDoeResult.Value?.name).toEqual(customerData[0].name);
    expect(johnDoesTransactions.Value?.length).toEqual(2);
  });

  it('should retain data between connections', async () => {
    db.Disconnect();
    await db.Connect();

    const customersResult = await db.GetAll<Customer>(StoreNames.Customers);

    expect(customersResult.Value?.length).toEqual(2);
  });
});
