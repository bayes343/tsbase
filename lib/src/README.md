# tsbase
TypeScript base class libraries

[![Build status](https://joseph-w-bayes.visualstudio.com/tsbase/_apis/build/status/Test,%20Build,%20Archive)](https://joseph-w-bayes.visualstudio.com/tsbase/_build/latest?definitionId=7)

**Code coverage - 95% statement | 91% branch**

TypeScript is awesome, especially if you're coming from a .Net background.  If you're like me though, much of the joy of working with C# comes from the **ubiquitous** wealth of base class libraries offered by the .Net framework.  There are plenty of frontend frameworks, and much of this pain is eliminated by picking one, however, these usually, and I would say rightfully, focus on presentation layer concerns and are much higher level than .Net's Generic Collection and Linq libraries.  I would say Angular, Vue, React, etc. sit much closer to ASP.Net MVC, WPF, or UWP than they do to the .Net base class libraries (.Net Framework).

My goal with this project is to build out a more pure TypeScript framework.  Not a frontend framework, but a set of base class libraries that can be taken with you regardless of what *presentation* technology (Angular, React, etc.) is used.

This project is very heavily influenced by the .Net framework; in many cases that is intentional.  These APIs in particular have their public interfaces modeled very closely after their .Net Framework equivalents:
- Enumerable\<T> (IEnumerable\<T>)
- List\<T>
- HttpClient

All glory to Microsoft for developing such awesome interfaces.

---

## Available APIs
### Enumerable

Provides a generic interface for interacting with and querying a collection of things.
   
   ```ts
   abstract class Enumerable<T>
   ```

   Properties:
   ```ts
   Item: Array<T>;
   ```

   Methods:
   ```ts
   Aggregate<TResult, TAccumulate>(seed: TAccumulate, func: (current: TAccumulate, next: T) => TAccumulate, resultSelector: (item: TAccumulate) => TResult): TResult
   All(func: (item: T) => boolean): boolean
   Any(func: (item: T) => boolean): boolean
   Average(func?: (item: T) => any): number
   Sum(func?: (item: T) => number): number
   Where(func: (item: T) => boolean): Enumerable<T>
   OrderBy(funcs?: Array<(item: T) => any>): Enumerable<T>
   OrderByDescending(funcs?: Array<(item: T) => any>): Enumerable<T>
   ToList(): List<T>
   ToArray(): Array<T>
   Take(count: number): Enumerable<T>
   TakeWhile(func: (item: T) => boolean): Enumerable<T>
   Distinct(): Enumerable<T>
   Skip(count: number): Enumerable<T>
   SkipWhile(func: (item: T) => boolean): Enumerable<T>
   ```

   #### Usage Example:
   ```ts
   // Instantiate class that extends Enumerable<T>
   public people = new List<Person>([
      new Person('John Doe', 18),
      new Person('James Doe', 27),
      new Person('Joe Doe', 18),
      new Person('Jack Doe', 45)
   ]);

   // Use APIs as desired
   // Where example:
   const jack = people.Where(item => item.Name === 'Jack Doe')[0];

   // OrderBy example:
   const youngestAlphaSort = people.OrderBy([
      item => item.Age,
      item => item.Name
   ]);

   // Sum example:
   const sumOfAges = people.Sum(item => item.Age);
   ```

---

### List

Provides a generic interface for mutably interacting with a collection of things.
    
   ```ts
   class List<T> extends Enumerable<T>
   ```

   Properties:
   ```ts
   Count: number;
   Item: Array<T>;
   ```

   Methods:
   ```ts
   Add(object: T): void
   AddRange(elements: Array<T>): void
   Clear(): void
   Contains(object: T): boolean
   CopyTo(array: Array<T>, startIndex?: number, endIndex?: number): void
   Exists(match: (item: T) => boolean): boolean
   Find(match: (item: T) => boolean): T | null
   FindAll(match: (item: T) => boolean): List<T>
   FindIndex(match: (item: T) => boolean, startIndex?: number, endIndex?: number): number
   FindLast(match: (item: T) => boolean): T | null
   FindLastIndex(match: (item: T) => boolean, startIndex?: number, endIndex?: number): number
   ForEach(action: (item: T) => any): void
   GetRange(index: number, count: number): List<T>
   IndexOf(item: T, startIndex?: number): number
   LastIndexOf(item: T, endIndex?: number): number
   TrueForAll(match: (item: T) => boolean): boolean
   Sort(comparison?: (item: T) => any): void
   Insert(index: number, item: T): void
   InsertRange(index: number, collection: List<T>): void
   Remove(item: T): boolean
   RemoveAll(match: (item: T) => boolean): number
   RemoveAt(index: number): void
   RemoveRange(index: number, count: number): void
   Reverse(): void
   ReverseRange(index: number, count: number): void
   ```

   #### Usage Example:
   ```ts
   // Instantiate a List<T>
   public people = new List<Person>([
      new Person('John Doe', 18),
      new Person('James Doe', 27),
      new Person('Joe Doe', 18),
      new Person('Jack Doe', 45)
   ]);

   // Use APIs as desired
   // Sort example:
   people.Sort(item => item.Age);

   // Find / Remove example:
   const jack = people.Find(item => item.Name === 'Jack Doe');
   people.Remove(jack);
   ```
---

### HttpClient

Provides an abstraction for making HTTP requests that can be `async await`ed.

   ```ts
   class HttpClient
   ```

   Properties
   ```ts
   public BaseAddress = '';
   public DefaultRequestHeaders = new Array<KeyValue>();
   public Timeout = 10;
   ```

   Methods
   ```ts
   public CancelPendingRequests(): void
   public async DeleteAsync(uri: string): Promise<HttpResponseMessage>
   public async GetAsync(uri: string): Promise<HttpResponseMessage>
   public async GetStringAsync(uri: string): Promise<string>
   public async PatchAsync(uri: string, payload: any): Promise<HttpResponseMessage>
   public async PostAsync(uri: string, payload: any):  Promise<HttpResponseMessage>
   public async PutAsync(uri: string, payload: any): Promise<HttpResponseMessage>
   public async SendAsync(httpRequestMessage: HttpRequestMessage): Promise<HttpResponseMessage>
   ```

   #### Usage Example:
   ```ts
   // Instantiate an HttpClient
   const client = new HttpClient();

   // Configure base address if desired
   client.BaseAddress = 'https://foaas.com';
   
   // Await a request
   const response = await client.GetStringAsync('cup/Joe');
   ```

---

### JsonSerializer

Solves a common problem of getting class instances from anonymous objects in JavaScript.

   ```ts
   class JsonSerializer<T> implements ISerializer<T>
   ```

   Methods
   ```ts
   public Serialize(t: { new(): T; }, json: any): T;
   ```

   #### Usage Example:
   ```ts
   // Get your JSON data
   const peopleDataObj = JSON.parse(peopleData);
   
   // Instantiate a JsonSerializer
   const serializer = new JsonSerializer<Person>();
   
   // Trade anonymous objects for class instances and use their instance members
   for (const person of peopleDataObj["people"]) {
      const personInstance = serializer.Serialize(Person, person);
      personInstance.MakePhoneCall();
   }
   ```

---

### Repository

Extends the generic List<T> with persistence capabilities, to include retrieval of previously persisted data on instantiation. 

   ```ts
   class Repository<T> extends List<T>
   ```

   Methods
   ```ts
   public SaveChanges(): void
   public PurgeData(): void
   ```

   #### Usage Example:
   ```ts
   // Instantiate repository
   // *Repository will init with previously stored data if available
   public peopleRepo = new Repository<Person>(
    new WebStoragePersister( // <- Used to store data using Dom Storage APIs
       "people", // <- key
       "local" // <- Dom Storage Type (session or local)
       )
   );

   // Add items, just as with any other list
   const person = new Person();
   this.peopleRepo.Add(person);

   // Save changes
   this.peopleRepo.SaveChanges();

   // Delete persisted data
   this.peopleRepo.PurgeData();
   ```

---

### Timer

A wrapper around the setInterval function allowing the consumer to add functions to an array that will be called at a given interval. 

   ```ts
   class Timer
   ```

   Methods
   ```ts
   public async Start(): Promise<any>
   public Stop(): void
   ```

   #### Usage Example:
   ```ts
   // Instantiate timer with a desired interval
   const timer = new Timer(1000);
   
   // Add functions the timer should call at the specified interval
   timer.Elapsed.push(() => {
      console.log('fake');
      currenTimeSpan.innerText = new Date(Date.now()).toLocaleTimeString();
   });
   
   timer.AutoReset = true; // set to true if the timer should fire more than once
   
   timer.Start(); // start the timer
   timer.Stop(); // stop the timer
   ```