import { Customer, Transaction } from './types';

export const customerData: Customer[] = [
  {
    id: 1,
    name: 'John Doe',
    birthDate: new Date(1985, 1, 1)
  },
  {
    id: 2,
    name: 'Jane Doe',
    birthDate: new Date(1995, 1, 1)
  }
];

export const transactionData: Transaction[] = [
  {
    id: 1,
    customerId: 1,
    total: 100
  },
  {
    id: 2,
    customerId: 1,
    total: 50
  },
  {
    id: 3,
    customerId: 2,
    total: 300
  }
];
