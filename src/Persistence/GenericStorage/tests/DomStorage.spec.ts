/**
 * @jest-environment jsdom
 */

import { DomStorageMode, DomStorage } from '../DomStorage';
import { Strings } from '../../../System/Strings';
import { JsonSerializer } from '../../../Utility/Serialization/JsonSerializer';
import { IGenericStorage } from '../IGenericStorage';

class Car {
  constructor(
    public Make: string = Strings.Empty,
    public Model: string = Strings.Empty
  ) { }

  public get FullName(): string {
    return `${this.Make} ${this.Model}`;
  }
}

describe('DomStorage', () => {
  let classUnderTest: IGenericStorage;
  const key = 'test';
  const myCar = new Car('Mitsubishi', 'Lancer');

  beforeEach(() => {
    classUnderTest = new DomStorage(DomStorageMode.Session, new JsonSerializer());
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should set generic key value pairs in session storage', () => {
    classUnderTest = new DomStorage(DomStorageMode.Session);
    const result = classUnderTest.Set<Car>(key, myCar);
    expect(result.IsSuccess).toBeTruthy();
  });

  it('should set generic key value pairs in local storage', () => {
    classUnderTest = new DomStorage(DomStorageMode.Local);
    const result = classUnderTest.Set<Car>(key, myCar);
    expect(result.IsSuccess).toBeTruthy();
  });

  it('should get generic key value pairs in session storage', () => {
    classUnderTest = new DomStorage(DomStorageMode.Local);
    classUnderTest.Set<Car>(key, myCar);

    const result = classUnderTest.Get(Car, key);

    expect(result.IsSuccess).toBeTruthy();
    expect(result.Value ? result.Value.FullName : Strings.Empty)
      .toEqual(`${myCar.Make} ${myCar.Model}`);
  });

  it('should return null when an unset key is requested', () => {
    const result = classUnderTest.Get(Car, 'fake');
    expect(result.IsSuccess).toBeTruthy();
    expect(result.Value).toBeNull();
  });

  it('should successfully remove a key value pair', () => {
    classUnderTest.Set<Car>(key, myCar);
    const result = classUnderTest.Remove(key);
    expect(result.IsSuccess).toBeTruthy();
  });

  it('should successfully set and get simple string values', () => {
    classUnderTest.SetValue('key', 'value');
    const result = classUnderTest.GetValue('key');

    expect(result.IsSuccess).toBeTruthy();
    expect(result.Value).toEqual('value');
  });

  it('should return null when an unset key is requested', () => {
    const result = classUnderTest.GetValue('fake');
    expect(result.IsSuccess).toBeTruthy();
    expect(result.Value).toBeNull();
  });

});
