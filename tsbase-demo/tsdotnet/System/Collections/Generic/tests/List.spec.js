import { List } from "../List";
describe('List', () => {
    let classUnderTest;
    beforeEach(() => {
        classUnderTest = new List();
    });
    it('should construct with no params', () => {
        expect(classUnderTest).toBeDefined();
    });
    it('should be constructed with a parameter array - making a copy of the passed array', () => {
        classUnderTest = new List([1, 2, 3]);
        expect(classUnderTest.Count).toEqual(3);
        // Ensure array is copied
        const newList = new List(classUnderTest.Item);
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
    it('should evaluate if an item is contained within a collection', () => {
        classUnderTest.AddRange(['1', '2', '3']);
        const truthy = classUnderTest.Contains('1');
        const falsy = classUnderTest.Contains('4');
        expect(truthy).toBeTruthy();
        expect(falsy).toBeFalsy();
        // complex object
        classUnderTest = new List();
        const testObject = { name: 'Joey', description: 'Developer of this library' };
        classUnderTest.Add(testObject);
        const truthy2 = classUnderTest.Contains(testObject);
        const falsy2 = classUnderTest.Contains({ name: 'Fake', description: 'does not exist' });
        expect(truthy2).toBeTruthy();
        expect(falsy2).toBeFalsy();
    });
    it('should copy contained elements to an array', () => {
        const fullCopy = [];
        classUnderTest.AddRange(['1', '2', '3']);
        classUnderTest.CopyTo(fullCopy);
        expect(fullCopy.length).toEqual(3);
        const firstElement = [];
        classUnderTest.CopyTo(firstElement, 0, 1);
        expect(firstElement.length).toEqual(1);
        const lastTwoElements = [];
        classUnderTest.CopyTo(lastTwoElements, 1);
        expect(lastTwoElements.length).toEqual(2);
    });
    it('should evaluate if an element exists based on the predicate passed', () => {
        classUnderTest.AddRange(['1', '2', '3']);
        const truthy = classUnderTest.Exists(item => item === '3');
        expect(truthy).toBeTruthy();
        const falsy = classUnderTest.Exists(item => item === '5');
        expect(falsy).toBeFalsy();
    });
    it('should find an element that matches a predicate', () => {
        classUnderTest.AddRange(['1', '2', '3']);
        const match = classUnderTest.Find(item => item === '3');
        expect(match).toBeTruthy();
        const noMatch = classUnderTest.Find(item => item === '5');
        expect(noMatch).toBeFalsy();
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
    it('should find the last element that matches a predicate', () => {
        classUnderTest.AddRange(['1', '2', '3']);
        const match = classUnderTest.FindLast(item => item.length === 1);
        expect(match).toEqual('3');
        const noMatch = classUnderTest.FindLast(item => item === '5');
        expect(noMatch).toBeFalsy();
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
        classUnderTest.ForEach(item => {
            counter++;
        });
        expect(counter).toEqual(4);
        // internal scope
        let currentValue = '';
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
        const arrayOfList = classUnderTest.ToArray();
        expect(arrayOfList.length).toEqual(4);
    });
    it('should evaluate whether a predicate matches all elements in the array', () => {
        classUnderTest.AddRange(['1', '2', '3', '21']);
        const truthy = classUnderTest.TrueForAll(item => item.length >= 1);
        expect(truthy).toBeTruthy();
        const falsy = classUnderTest.TrueForAll(item => item.length === 1);
        expect(falsy).toBeFalsy();
    });
    it('should sort a list based on a comparison function', () => {
        classUnderTest.AddRange(['2', '1', '3', '21', '0', '0']);
        classUnderTest.Sort(item => parseInt(item));
        expect(classUnderTest.Item[0]).toEqual('0');
        expect(classUnderTest.Item[5]).toEqual('21');
        classUnderTest.Clear();
        classUnderTest.AddRange([1, 3, 8, 2, 1]);
        classUnderTest.Sort();
        expect(classUnderTest.Item[1]).toEqual(1);
        expect(classUnderTest.Item[4]).toEqual(8);
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
        // error
        expect(() => {
            classUnderTest.Insert(5, '6');
        }).toThrowError('IndexOutOfRange - Range: 0-3 | Passed index: 5');
    });
    it('should insert a range into the List at a specified index', () => {
        classUnderTest.AddRange(['1', '5']);
        classUnderTest.InsertRange(1, new List(['2', '3', '4']));
        expect(classUnderTest.Item[1]).toEqual('2');
        expect(classUnderTest.Item[3]).toEqual('4');
        // error
        expect(() => {
            classUnderTest.InsertRange(6, new List(['2', '3', '4']));
        }).toThrowError('IndexOutOfRange - Range: 0-5 | Passed index: 6');
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
        // error
        expect(() => {
            classUnderTest.RemoveAt(3);
        }).toThrowError('IndexOutOfRange - Range: 0-2 | Passed index: 3');
    });
    it('should remove a range from the list based on the passed paramaters', () => {
        classUnderTest.AddRange(['1', '2', '3', '4', '5']);
        classUnderTest.RemoveRange(0, 2);
        expect(classUnderTest.Item[0]).toEqual('3');
        // error
        expect(() => {
            classUnderTest.RemoveRange(0, 5);
        }).toThrowError('IndexOutOfRange - Range: 0-3 | Passed index: 0 | Passed count: 5');
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
});
//# sourceMappingURL=List.spec.js.map