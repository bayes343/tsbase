export enum StoreNames {
  Customers = 'customers',
  Transactions = 'transactions'
}

export type Customer = {
  id: number,
  name: string,
  birthDate: Date
};

export type Transaction = {
  id: number,
  customerId: number,
  total: number
};
