export interface IContainer<T> {
  Init(t: T): void;
  Get<D>(dependency: (t: T) => D): D;
}

const di = {} as IContainer<{test: string}>;

di.Get(d => d.test);
