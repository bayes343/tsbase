export type Transaction<T> = {
  timestamp: number,
  path: string,
  toState: T,
  fromState?: T,
  voided: boolean
};
