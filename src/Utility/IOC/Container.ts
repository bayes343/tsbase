import { IContainer } from './IContainer';

export class Container<T> implements IContainer<T> {
  private dependencies: T | null = null;

  constructor() { }

  public Init(t: T) {
    this.dependencies = t;
  }

  public Get<D>(dependency: (t: T) => D): D {
    if (this.dependencies === null) {
      throw new Error('IOC container not yet initialized. Call Init() before Get().');
    }

    return dependency(this.dependencies);
  }
}
