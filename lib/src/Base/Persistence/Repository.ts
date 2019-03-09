import { List } from '../Collections/List';
import { IPersistable } from './IPersistable';
import { Enumerable } from '../Collections/Query/Enumerable';
import { ISerializer } from '../Utility/Serialization/ISerializer';
import { Rule } from './Integrity/Rule';
import { Severity } from './Integrity/Severity';

/**
 * An extension of the List<T> class that incorporates persistence functionality 
 * provided by a class implementing IPersistable.  Previously persisted data is
 * loaded on instantiation using the default persister's "Retrieve" method. 
 */
export class Repository<T> extends List<T> {
  /**
   * A set of rules the repository will check against when new elements are added
   * Rules that have a severity of "Error" will not be added
   */
  public Rules = new Array<Rule<T>>();
  private savedData: Array<T>;

  constructor(
    private persister: IPersistable,
    private serializer?: ISerializer<T>,
    private serializeAs?: { new(): T; }
  ) {
    super();
    let initialData = persister.Retrieve();
    initialData = initialData && initialData.length >= 1 ? initialData : new Array<T>();
    this.Item = serializer && serializeAs ? this.getSerializedInstancesFromInitialData(initialData) : initialData;
    this.savedData = this.Item;
  }

  /**
   * Calls the underlying persister's "Persist" method saving the data currently in the list
   */
  public SaveChanges(): void {
    this.persister.Persist(this.Item);
    this.savedData = this.Item;
  }

  /**
   * Calls the underlying persister's "Purge" method deleting any data previously persisted and clearing the list
   */
  public PurgeData(): void {
    this.persister.Purge();
    this.Clear();
  }

  /**
   * Returns a collection of elements that have not been saved
   */
  public GetUnsavedElements(): Enumerable<T> {
    return this.Except(this.savedData);
  }

  //#region Overrides
  public Add(object: T) {
    if (this.itemIsCompliantWithRules(object)) {
      super.Add(object);
    }
  }

  public AddRange(elements: Array<T>) {
    let candidates = new List<T>(elements);
    candidates = candidates.Where(item => this.itemIsCompliantWithRules(item)) as List<T>;
    super.AddRange(candidates.ToArray());
  }

  public Insert(index: number, item: T): void {
    if (this.itemIsCompliantWithRules(item)) {
      super.Insert(index, item);
    }
  }

  public InsertRange(index: number, collection: List<T>): void {
    const candidates = collection.Where(item => this.itemIsCompliantWithRules(item)) as List<T>;
    super.InsertRange(index, candidates);
  }
  //#endregion 

  private getSerializedInstancesFromInitialData(initialData: Array<any>): Array<T> {
    const classInstances = new Array<T>();
    initialData.forEach(element => {
      if (this.serializer && this.serializeAs) {
        classInstances.push(this.serializer.Serialize(this.serializeAs, element));
      } else {
        throw new Error('OperationInvalid - cannot attempt serialization without a serializer and a class constructor');
      }
    });
    return classInstances;
  }

  private itemIsCompliantWithRules(item: T): boolean {
    let compliant = true;
    this.Rules.forEach(element => {
      if (!element.ComplianceTest(item)) {
        compliant = element.Severity !== Severity.Error;
        this.handleNonCompliance(element);
      }
    });
    return compliant;
  }

  private handleNonCompliance(rule: Rule<T>): void {
    if (rule.Severity === Severity.Error) {
      console.error(rule.Description);
    } else if (rule.Severity === Severity.Warning) {
      console.warn(rule.Description);
    } else {
      console.info(rule.Description);
    }
  }
}
