/* eslint-disable max-lines */
import { List } from '../List';
import { Queryable } from '../Queryable';

describe('Queryable', () => {
  let classUnderTest: Queryable<any>;

  beforeEach(() => {
    classUnderTest = new List<any>();
  });

  it('should evaluate if an item is contained within a collection', () => {
    (classUnderTest as List<any>).AddRange(['1', '2', '3']);
    const truthy = classUnderTest.item.includes('1');
    const falsy = classUnderTest.item.includes('4');
    expect(truthy).toBeTruthy();
    expect(falsy).toBeFalsy();

    // complex object
    classUnderTest = new List<{ name: string, description: string }>();
    const testObject = { name: 'Joey', description: 'Developer of this library' };
    (classUnderTest as List<any>).Add(testObject);
    const truthy2 = classUnderTest.item.includes(testObject);
    const falsy2 = classUnderTest.item.includes({ name: 'Fake', description: 'does not exist' });
    expect(truthy2).toBeTruthy();
    expect(falsy2).toBeFalsy();
  });
});
