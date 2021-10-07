/* eslint-disable max-lines */
import { List } from '../List';
import { Errors } from '../../Errors';
import { Strings } from '../../Functions/Strings';
import { Logger, LogLevel } from '../../Utility/Logger/module';

describe('List', () => {
  let classUnderTest: List<any>;

  beforeEach(() => {
    classUnderTest = new List<string>();
  });

  it('should construct with no params', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should be constructed with a parameter array - making a copy of the passed array', () => {
    classUnderTest = new List<number>([1, 2, 3]);
    expect(classUnderTest.Count).toEqual(3);

    // Ensure array is copied
    const newList = new List<number>(classUnderTest.Item);
    classUnderTest.RemoveAt(classUnderTest.Count - 1);
    expect(classUnderTest.Item.length).toEqual(2);
    expect(newList.Item.length).toEqual(3);
  });

  it('should add objects to the collection', () => {
    classUnderTest.Add('String1');
    classUnderTest.Add('String2');
    classUnderTest.Add('String3');
    expect(classUnderTest.Count).toEqual(3);
  });

  it('should add a range of objects to the collection', () => {
    classUnderTest.AddRange(['1', '2', '3']);
    expect(classUnderTest.Count).toEqual(3);
  });

  it('should clear the collection', () => {
    classUnderTest.AddRange(['1', '2', '3']);
    classUnderTest.Clear();
    expect(classUnderTest.Count).toEqual(0);
  });

  it('should copy contained elements to an array', () => {
    const fullCopy: Array<string> = [];
    classUnderTest.AddRange(['1', '2', '3']);
    classUnderTest.CopyTo(fullCopy);
    expect(fullCopy.length).toEqual(3);

    const firstElement: Array<string> = [];
    classUnderTest.CopyTo(firstElement, 0, 1);
    expect(firstElement.length).toEqual(1);

    const lastTwoElements: Array<string> = [];
    classUnderTest.CopyTo(lastTwoElements, 1);
    expect(lastTwoElements.length).toEqual(2);
  });

  it('should find all / return all elements that match a predicate', () => {
    classUnderTest.AddRange(['1', '2', '3', '21']);
    const threeElements = classUnderTest.FindAll(item => item.length === 1);
    expect(threeElements.Count).toEqual(3);
  });

  it('should find the index of the first element that matches a predicate', () => {
    classUnderTest.AddRange(['1', '2', '3', '21']);
    const zero = classUnderTest.FindIndex(item => item === '1');
    expect(zero).toEqual(0);

    // start index
    const two = classUnderTest.FindIndex(item => item.length === 1, 2);
    expect(two).toEqual(2);

    // end range
    const three = classUnderTest.FindIndex(item => item.length >= 2, 2, classUnderTest.Count);
    expect(three).toEqual(3);

    const notFound = classUnderTest.FindIndex(item => item === '0');
    expect(notFound).toEqual(-1);
  });

  it('should find the last index of the first element that matches a predicate', () => {
    classUnderTest.AddRange(['1', '2', '3', '21']);
    const zero = classUnderTest.FindLastIndex(item => item.length === 1);
    expect(zero).toEqual(2);

    // start index
    const two = classUnderTest.FindLastIndex(item => item.length === 1, 2);
    expect(two).toEqual(2);

    // // end range
    const three = classUnderTest.FindLastIndex(item => item.length >= 1, 0, classUnderTest.Count - 1);
    expect(three).toEqual(3);

    const notFound = classUnderTest.FindLastIndex(item => item === '0');
    expect(notFound).toEqual(-1);
  });

  it('should apply an action foreach element in the list', () => {
    // external scope
    let counter = 0;
    classUnderTest.AddRange(['1', '2', '3', '21']);
    classUnderTest.ForEach(() => {
      counter++;
    });
    expect(counter).toEqual(4);

    // internal scope
    let currentValue = Strings.Empty;
    classUnderTest.ForEach(item => {
      currentValue = item;
    });
    expect(currentValue).toEqual('21');
  });

  it('should get a range of the list', () => {
    classUnderTest.AddRange(['1', '2', '3', '21']);
    const range = classUnderTest.GetRange(0, 2);
    expect(range.Count).toEqual(2);
  });

  it('should return a new array if requested', () => {
    classUnderTest.AddRange(['1', '2', '3', '21']);
    const arrayOfList = classUnderTest.item.slice();
    expect(arrayOfList.length).toEqual(4);
  });

  it('should get the index of an item, considering any range passed', () => {
    classUnderTest.AddRange(['2', '1', '3', '21', '0', '0']);
    const indexTwo = classUnderTest.IndexOf('3');
    expect(indexTwo).toEqual(2);

    const notFound = classUnderTest.IndexOf('2', 2);
    expect(notFound).toEqual(-1);
  });

  it('should get the last index of an item, considering any range passed', () => {
    classUnderTest.AddRange(['3', '2', '1', '3', '21', '0', '0', '2']);
    const indexTwo = classUnderTest.LastIndexOf('3');
    expect(indexTwo).toEqual(3);

    const notFound = classUnderTest.LastIndexOf('2', classUnderTest.Count - 2);
    expect(notFound).toEqual(1);
  });

  it('should insert item into a the list at a specified index', () => {
    classUnderTest.AddRange(['1', '3']);
    classUnderTest.Insert(1, '2');
    expect(classUnderTest.Item[1]).toEqual('2');

    classUnderTest.Insert(5, '6');
    const logEntry = Logger.Instance.LogEntries.find(l => l.Message === `${Errors.IndexOutOfRange} - Range: 0-3 | Passed index: 5`);
    expect(logEntry).toBeTruthy();
    expect(logEntry?.Level).toEqual(LogLevel.Error);
    expect(logEntry?.Error).toBeDefined();
  });

  it('should insert a range into the List at a specified index', () => {
    classUnderTest.AddRange(['1', '5']);
    classUnderTest.InsertRange(1, new List<string>(['2', '3', '4']));
    expect(classUnderTest.Item[1]).toEqual('2');
    expect(classUnderTest.Item[3]).toEqual('4');

    classUnderTest.InsertRange(6, new List<string>(['2', '3', '4']));
    const logEntry = Logger.Instance.LogEntries.find(l => l.Message === `${Errors.IndexOutOfRange} - Range: 0-5 | Passed index: 6`);
    expect(logEntry).toBeTruthy();
    expect(logEntry?.Level).toEqual(LogLevel.Error);
    expect(logEntry?.Error).toBeDefined();
  });

  it('should remove an element passed', () => {
    classUnderTest.AddRange(['1', '2', '3']);
    classUnderTest.Remove('2');
    expect(classUnderTest.Item[1]).toEqual('3');
    expect(classUnderTest.Remove('2')).toBeFalsy();
  });

  it('should remove all items that match the passed predicate', () => {
    classUnderTest.AddRange(['1', '2', '3']);
    const count = classUnderTest.RemoveAll(item => parseInt(item) > 1);
    expect(count).toEqual(2);
    expect(classUnderTest.Count).toEqual(1);
  });

  it('should remove an element at a given index', () => {
    classUnderTest.AddRange(['1', '2', '3']);
    classUnderTest.RemoveAt(1);
    expect(classUnderTest.Count).toEqual(2);
    expect(classUnderTest.Item[1]).toEqual('3');

    classUnderTest.RemoveAt(3);
    const logEntry = Logger.Instance.LogEntries.find(l => l.Message === `${Errors.IndexOutOfRange} - Range: 0-2 | Passed index: 3`);
    expect(logEntry).toBeTruthy();
    expect(logEntry?.Level).toEqual(LogLevel.Error);
    expect(logEntry?.Error).toBeDefined();
  });

  it('should remove a range from the list based on the passed paramaters', () => {
    classUnderTest.AddRange(['1', '2', '3', '4', '5']);
    classUnderTest.RemoveRange(0, 2);
    expect(classUnderTest.Item[0]).toEqual('3');

    classUnderTest.RemoveRange(0, 5);
    const logEntry = Logger.Instance.LogEntries.find(l => l.Message === `${Errors.IndexOutOfRange} - Range: 0-3 | Passed index: 0 | Passed count: 5`);
    expect(logEntry).toBeTruthy();
    expect(logEntry?.Level).toEqual(LogLevel.Error);
    expect(logEntry?.Error).toBeDefined();
  });

  it('should remove a range of elements from the list', () => {
    classUnderTest.AddRange(['1', '2', '3', '4', '5']);
    classUnderTest.RemoveRange(1, 3);
    expect(classUnderTest.Count).toEqual(2);
  });

  it('should reverse the elements in the list', () => {
    classUnderTest.AddRange(['1', '2', '3', '4', '5']);
    classUnderTest.Reverse();
    expect(classUnderTest.Item[0]).toEqual('5');
    expect(classUnderTest.Item[4]).toEqual('1');
  });

  it('should reverse a range of elements within the list', () => {
    classUnderTest.AddRange(['1', '2', '3', '4', '5']);
    classUnderTest.ReverseRange(1, 3);
    expect(classUnderTest.Item[0]).toEqual('1');
    expect(classUnderTest.Item[1]).toEqual('4');
    expect(classUnderTest.Item[3]).toEqual('2');
  });

  it('should properly identify the count of items in the underlying data structure', () => {
    classUnderTest.AddRange([1, 2, 3]);
    classUnderTest.Item.push(4);
    expect(classUnderTest.Count).toEqual(4);
  });
});
