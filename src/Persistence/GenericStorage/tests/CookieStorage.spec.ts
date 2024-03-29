/**
 * @jest-environment jsdom
 */

import { Mock } from 'tsmockit';
import { Strings } from '../../../System/Strings';
import { JsonSerializer } from '../../../Utility/Serialization/JsonSerializer';
import { IGenericStorage } from '../IGenericStorage';
import { CookieStorage } from '../CookieStorage';

class Car {
  constructor(
    public Make: string = Strings.Empty,
    public Model: string = Strings.Empty
  ) { }

  public get FullName(): string {
    return `${this.Make} ${this.Model}`;
  }
}

describe('CookieStorage', () => {
  const mockDocument = new Mock<Document>();
  let classUnderTest: IGenericStorage;
  const key = 'test';
  const myCar = new Car('Mitsubishi', 'Lancer');

  beforeEach(() => {
    classUnderTest = new CookieStorage(new JsonSerializer(), mockDocument.Object);
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
    expect(new CookieStorage()).toBeDefined();
  });

  it('should set generic key value pairs as cookies', () => {
    const result = classUnderTest.Set<Car>(key, myCar);

    expect(result.IsSuccess).toBeTruthy();
    expect(mockDocument.Object.cookie).toEqual('test={"Make":"Mitsubishi","Model":"Lancer"};path=/;secure=true;samesite=strict;');
  });

  it('should get generic key value pairs from cookies', () => {
    mockDocument.Object.cookie = 'test={"Make":"Mitsubishi","Model":"Lancer"};';
    const result = classUnderTest.Get(Car, key);

    expect(result.IsSuccess).toBeTruthy();
    expect(result.Value ? result.Value.FullName : Strings.Empty)
      .toEqual(`${myCar.Make} ${myCar.Model}`);
  });

  it('should return a failed result if an error occurs during a get query', () => {
    const result = classUnderTest.Get(Car, 'fake');

    expect(result.IsSuccess).toBeFalsy();
    expect(result.ErrorMessages[0]).toEqual('Unable to retrieve "fake"');
  });

  it('should successfully remove a cookie', () => {
    classUnderTest.Set<Car>(key, myCar);
    const result = classUnderTest.Remove(key);
    expect(result.IsSuccess).toBeTruthy();
  });

  it('should successfully remove a cookie from a custom path', () => {
    (classUnderTest as CookieStorage).Set<Car>(key, myCar, {
      path: '/test'
    });
    const result = (classUnderTest as CookieStorage).Remove(key, '/test');
    expect(result.IsSuccess).toBeTruthy();
  });

  it('should successfully set and get simple string values', () => {
    classUnderTest.SetValue('key', 'value');
    const result = classUnderTest.GetValue('key');

    expect(result.IsSuccess).toBeTruthy();
    expect(result.Value).toEqual('value');
  });

  it('should successfully set and get a cookie with an expiration date', () => {
    const date = new Date();
    (classUnderTest as CookieStorage).SetValue('key', 'value', { expires: date });

    classUnderTest.GetValue('key');

    expect(mockDocument.Object.cookie).toContain(date.toUTCString());
  });

  it('should return a failed result if an error occurs during a get value query', () => {
    const result = classUnderTest.GetValue('fake');

    expect(result.IsSuccess).toBeFalsy();
    expect(result.ErrorMessages[0]).toEqual('Unable to retrieve "fake"');
  });

  it('should correctly format a cookie with all custom options', () => {
    const date = new Date();
    const expectedCookie = `one=1;expires=${date.toUTCString()};domain=.domain.com;path=/example;secure=true;samesite=strict;priority=high;`;

    (classUnderTest as CookieStorage).SetValue('one', '1', {
      domain: '.domain.com',
      expires: date,
      path: '/example',
      secure: true,
      samesite: 'strict',
      priority: 'high'
    });

    expect(mockDocument.Object.cookie).toEqual(expectedCookie);
  });

  it('should correctly format a cookie without date custom options', () => {
    const expectedCookie = 'one=1;domain=.domain.com;path=/example;secure=true;samesite=strict;priority=high;';

    (classUnderTest as CookieStorage).SetValue('one', '1', {
      domain: '.domain.com',
      path: '/example',
      secure: true,
      samesite: 'strict',
      priority: 'high'
    });

    expect(mockDocument.Object.cookie).toEqual(expectedCookie);
  });
});
