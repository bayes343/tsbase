import { Enumerable } from '../../Linq/Enumerable';
export class List extends Enumerable {
    constructor(initParam) {
        super();
        /**
         * Gets the number of elements contained in the List<T>.
         */
        this.Count = 0;
        /**
         * Gets or sets the element at the specified index.
         */
        this.Item = new Array();
        if (initParam && initParam.length) {
            this.Item = initParam.slice();
        }
        this.updateProperties();
    }
    /**
     * Implement abstract enumerable contract
     * @param item
     */
    Clone(item) {
        return new List(item);
    }
    /**
     * Adds an object to the end of the List<T>.
     * @param object
     */
    Add(object) {
        this.Item.push(object);
        this.updateProperties();
    }
    /**
     * Adds the elements of the specified collection to the end of the List<T>.
     * @param elements
     */
    AddRange(elements) {
        this.Item = this.Item.concat(elements);
        this.updateProperties();
    }
    /**
     * Removes all elements from the List<T>.
     */
    Clear() {
        this.Item = new Array();
        this.updateProperties();
    }
    /**
     * Determines whether an element is in the List<T>.
     * Currently checks if every key on the parameter object matches every key on a member (contained) object
     * @param object
     */
    Contains(object) {
        let isContained = this.Item.indexOf(object) >= 0;
        if (!isContained && typeof object === 'object') {
            const stringifiedList = JSON.stringify(this.Item);
            const stringifiedObject = JSON.stringify(object);
            isContained = stringifiedList.indexOf(stringifiedObject) >= 0;
        }
        return isContained;
    }
    /**
     * Copies the List<T> or a portion of it to an array.
     * @param array
     * @param arrayIndex
     */
    CopyTo(array, startIndex, endIndex) {
        startIndex = startIndex ? startIndex : 0;
        endIndex = endIndex ? endIndex : this.Item.length;
        for (let index = startIndex; index < endIndex; index++) {
            const element = this.Item[index];
            array.push(element);
        }
    }
    /**
     * Determines whether the List<T> contains elements that match the conditions defined by the specified predicate.
     * @param match
     */
    Exists(match) {
        let answer = false;
        for (let index = 0; index < this.Item.length && !answer; index++) {
            const element = this.Item[index];
            if (match(element)) {
                answer = true;
            }
        }
        return answer;
    }
    /**
     * Searches for an element that matches the conditions defined by the specified predicate, and returns the first occurrence within the entire List<T>.
     * @param match
     */
    Find(match) {
        for (let index = 0; index < this.Item.length; index++) {
            const element = this.Item[index];
            if (match(element)) {
                return (element);
            }
        }
        return null;
    }
    /**
     * Retrieves all the elements that match the conditions defined by the specified predicate.
     * @param match
     */
    FindAll(match) {
        const matchingElements = this.Item.filter(item => match(item));
        return new List(matchingElements);
    }
    /**
     * Searches for an element that matches the conditions defined by a specified predicate, and returns the zero-based index of the first occurrence within the List<T> or a portion of it. This method returns -1 if an item that matches the conditions is not found.
     * @param match
     * @param startIndex
     * @param endIndex
     */
    FindIndex(match, startIndex, endIndex) {
        startIndex = startIndex ? startIndex : 0;
        endIndex = endIndex ? endIndex : this.Item.length;
        let index = -1;
        for (let i = startIndex; i < endIndex && index === -1; i++) {
            const element = this.Item[i];
            if (match(element)) {
                index = i;
            }
        }
        return index;
    }
    /**
     * Searches for an element that matches the conditions defined by the specified predicate, and returns the last occurrence within the entire List<T>.
     * @param match
     */
    FindLast(match) {
        for (let index = this.Count - 1; index >= 0; index--) {
            const element = this.Item[index];
            if (match(element)) {
                return (element);
            }
        }
        return null;
    }
    /**
     * Searches for an element that matches the conditions defined by a specified predicate, and returns the zero-based index of the last occurrence within the List<T> or a portion of it.
     * @param match
     * @param startIndex
     * @param endIndex
     */
    FindLastIndex(match, startIndex, endIndex) {
        startIndex = startIndex ? startIndex : 0;
        endIndex = endIndex && endIndex <= this.Count - 1 ? endIndex : this.Count - 1;
        let index = -1;
        for (let i = endIndex; i >= startIndex && index === -1; i--) {
            const element = this.Item[i];
            if (match(element)) {
                index = i;
            }
        }
        return index;
    }
    /**
     * Performs the specified action on each element of the List<T>.
     * @param action
     */
    ForEach(action) {
        this.Item.forEach(element => {
            action(element);
        });
    }
    /**
     * Creates a shallow copy of a range of elements in the source List<T>.
     * @param index
     * @param count
     */
    GetRange(index, count) {
        const range = new List();
        for (let i = index; i < count; i++) {
            const element = this.Item[i];
            range.Add(element);
        }
        return range;
    }
    /**
     * Searches for the specified object and returns the zero-based index of the first occurrence within the range of elements in the List<T> that extends from the specified index to the last element.
     * @param item
     * @param startIndex
     */
    IndexOf(item, startIndex) {
        startIndex = startIndex ? startIndex : 0;
        let index = -1;
        for (let i = startIndex; i < this.Item.length && index === -1; i++) {
            if (JSON.stringify(item) === JSON.stringify(this.Item[i])) {
                index = i;
            }
        }
        return index;
    }
    /**
     * Returns the zero-based index of the last occurrence of a value in the List<T> or in a portion of it.
     * @param item
     * @param endIndex
     */
    LastIndexOf(item, endIndex) {
        endIndex = endIndex ? endIndex : this.Count - 1;
        let index = -1;
        for (let i = endIndex; i >= 0 && index === -1; i--) {
            if (JSON.stringify(item) === JSON.stringify(this.Item[i])) {
                index = i;
            }
        }
        return index;
    }
    /**
     * Determines whether every element in the List<T> matches the conditions defined by the specified predicate.
     * @param match
     */
    TrueForAll(match) {
        let result = true;
        for (let index = 0; index < this.Item.length && result === true; index++) {
            const element = this.Item[index];
            if (!match(element)) {
                result = false;
            }
        }
        return result;
    }
    /**
     * Sorts the elements or a portion of the elements in the List<T> using either the specified or default IComparer<T> implementation or a provided Comparison<T> delegate to compare list elements.
     * @param comparison
     */
    Sort(comparison) {
        if (comparison) {
            this.Item.sort((a, b) => {
                if (comparison(a) < comparison(b)) {
                    return -1;
                }
                else if (comparison(a) > comparison(b)) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
        }
        else {
            this.Item.sort();
        }
    }
    /**
     * Inserts an element into the List<T> at the specified index.
     * @param index
     * @param item
     */
    Insert(index, item) {
        if (index >= 0 && this.Item.length >= index) {
            this.Item.splice(index, 0, item);
            this.updateProperties();
        }
        else {
            throw new Error(`IndexOutOfRange - Range: 0-${this.Item.length} | Passed index: ${index}`);
        }
    }
    /**
     * Inserts the elements of a collection into the List<T> at the specified index.
     * @param index
     * @param collection
     */
    InsertRange(index, collection) {
        if (index >= 0 && this.Item.length >= index) {
            for (let i = 0; i < collection.Count; i++) {
                const element = collection.Item[i];
                this.Item.splice(index + i, 0, element);
            }
            this.updateProperties();
        }
        else {
            throw new Error(`IndexOutOfRange - Range: 0-${this.Item.length} | Passed index: ${index}`);
        }
    }
    /**
     * Removes the first occurrence of a specific object from the List<T>.
     * @param item
     */
    Remove(item) {
        const itemIndex = this.IndexOf(item);
        if (itemIndex >= 0) {
            this.Item.splice(itemIndex, 1);
            this.updateProperties();
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Removes all the elements that match the conditions defined by the specified predicate.
     * @param match
     */
    RemoveAll(match) {
        let count = 0;
        for (let index = 0; index < this.Item.length; index++) {
            const element = this.Item[index];
            if (match(element)) {
                this.Remove(element);
                index--;
                count++;
            }
        }
        return count;
    }
    /**
     * Removes the element at the specified index of the List<T>.
     * @param index
     */
    RemoveAt(index) {
        if (index >= 0 && this.Item.length >= index) {
            this.Item.splice(index, 1);
            this.updateProperties();
        }
        else {
            throw new Error(`IndexOutOfRange - Range: 0-${this.Item.length} | Passed index: ${index}`);
        }
    }
    /**
     * Removes a range of elements from the List<T>.
     * @param index
     * @param count
     */
    RemoveRange(index, count) {
        if (index >= 0 && this.Item.length >= index && this.Item.length >= index + count) {
            this.Item.splice(index, count);
            this.updateProperties();
        }
        else {
            throw new Error(`IndexOutOfRange - Range: 0-${this.Item.length} | Passed index: ${index} | Passed count: ${count}`);
        }
    }
    /**
     * Reverses the order of the elements in the entire List<T>.
     */
    Reverse() {
        this.Item.reverse();
    }
    /**
     * Reverses the order of the elements in the specified range.
     * @param index
     * @param count
     */
    ReverseRange(index, count) {
        const arraySegment = this.Item.splice(index, count);
        arraySegment.reverse();
        this.InsertRange(index, new List(arraySegment));
    }
    //#region Private implementation 'helpers'
    updateProperties() {
        this.Count = this.Item.length;
    }
}
//# sourceMappingURL=List.js.map