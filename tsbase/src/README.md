# tsbase

TypeScript is awesome, especially if you're coming from a .Net background.  If you're like me though, much of the joy of working with C# comes from the **ubiquitous** wealth of base class libraries offered by the .Net framework.  There are plenty of frontend frameworks, and much of this pain is eliminated by picking one, however, these usually, and I would say rightfully, focus on presentation layer concerns and are much higher level than .Net's Generic Collection and Linq libraries.  I would say Angular, Vue, React, etc. sit much closer to ASP.Net MVC, WPF, or UWP than they do to the .Net base class libraries (.Net Framework).

My goal with this project is to build out a more pure TypeScript framework.  Not a frontend framework, but a set of base class libraries that can be taken with you regardless of what *presentation* technology (Angular, React, etc.) is used.

So far, I've focused on collections.  The abstract class Enumerable and the concrete class List are TypeScript implementations of their dotnet equivalents, with some exceptions / limitations of course.

**100% Statement and Branch test coverage**

## Available APIs
### Abstractions
 - Enumerable 
    
    Definition:
    ```ts
    abstract class Enumerable<T>
    ```

    Properties:
    ```ts
    Count: number;
    Item: Array<T>;
    ```

    Methods:
    ```ts
   Aggregate<TResult, TAccumulate>(seed: TAccumulate, func: (current: TAccumulate, next: T) => TAccumulate, resultSelector: (item: TAccumulate) => TResult): TResult;
   All(func: (item: T) => boolean): boolean;
   Any(func: (item: T) => boolean): boolean;
   Average(func?: (item: T) => any): number;
   Sum(func?: (item: T) => number): number;
   Where(func: (item: T) => boolean): Enumerable<T>;
   OrderBy(funcs?: Array<(item: T) => any>): Enumerable<T>;
   OrderByDescending(funcs?: Array<(item: T) => any>): Enumerable<T>;
   ToList(): List<T>;
   ToArray(): Array<T>;
   Take(count: number): Enumerable<T>;
   TakeWhile(func: (item: T) => boolean): Enumerable<T>;
   Distinct(): Enumerable<T>;
   Skip(count: number): Enumerable<T>;
   SkipWhile(func: (item: T) => boolean): Enumerable<T>;
    ```


### Concretions
 - List
    
    Definition:
    ```ts
    class List<T> extends Enumerable<T>
    ```

    Properties:
    ```ts
    Item: Array<T>;
    ```

    Methods:
   ```ts
   Add(object: T): void;
   AddRange(elements: Array<T>): void;
   Clear(): void;
   Contains(object: T): boolean;
   CopyTo(array: Array<T>, startIndex?: number, endIndex?: number): void;
   Exists(match: (item: T) => boolean): boolean;
   Find(match: (item: T) => boolean): T | null;
   FindAll(match: (item: T) => boolean): List<T>;
   FindIndex(match: (item: T) => boolean, startIndex?: number, endIndex?: number): number;
   FindLast(match: (item: T) => boolean): T | null;
   FindLastIndex(match: (item: T) => boolean, startIndex?: number, endIndex?: number): number;
   ForEach(action: (item: T) => any): void;
   GetRange(index: number, count: number): List<T>;
   IndexOf(item: T, startIndex?: number): number;
   LastIndexOf(item: T, endIndex?: number): number;
   TrueForAll(match: (item: T) => boolean): boolean;
   Sort(comparison?: (item: T) => any): void;
   Insert(index: number, item: T): void;
   InsertRange(index: number, collection: List<T>): void;
   Remove(item: T): boolean;
   RemoveAll(match: (item: T) => boolean): number;
   RemoveAt(index: number): void;
   RemoveRange(index: number, count: number): void;
   Reverse(): void;
   ReverseRange(index: number, count: number): void;
   ```