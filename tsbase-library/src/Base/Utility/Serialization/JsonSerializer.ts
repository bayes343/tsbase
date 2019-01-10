import { ISerializer } from './ISerializer';

const keysToCheck = [
  'value',
  'target_id'
];

export class JsonSerializer<T> implements ISerializer<T> {
  public Serialize(t: { new(): T; }, json: any): T {
    const object: any = new t();

    const classProperties = Object.keys(object);;
    const jsonKeys = Object.keys(json);

    jsonKeys.forEach(element => {
      const instanceKey = this.getInstanceKey(classProperties, element);
      if (instanceKey !== '') {
        const property = object[instanceKey];
        const jsonElement = json[element];

        if (Array.isArray(property) || typeof property !== 'object') {
          this.serializeSimpleField(jsonElement, object, instanceKey);
        } else {
          const newSerializer = new JsonSerializer<any>();
          object[instanceKey] = newSerializer.Serialize(property.constructor, jsonElement[0]);
        }
      }
    });

    return object;
  }

  private getInstanceKey(fields: Array<string>, jsonKey: string): string {
    jsonKey = this.cleanString(jsonKey);
    let instanceKey: string = '';

    fields.forEach(element => {
      if (this.cleanString(element) === jsonKey) {
        instanceKey = element;
      }
    });

    return instanceKey;
  }

  private cleanString(stringToClean: string): string {
    stringToClean = stringToClean.replace('field_', '');
    return stringToClean.replace(/[^a-zA-Z0-9 -]/g, '').trim().replace(/ +/g, '-').toLowerCase();
  }

  private serializeSimpleField(jsonElement: any, object: any, instanceKey: string): void {
    if (!Array.isArray(jsonElement)) {
      object[instanceKey] = jsonElement;
    } else {
      if (jsonElement.length === 1) {
        object[instanceKey] = this.getSingleValue(jsonElement[0]);
      } else if (jsonElement.length > 1) {
        object[instanceKey] = this.getArrayValue(jsonElement);
      }
    }
  }

  private getSingleValue(object: any): any {
    let value: any = null;
    keysToCheck.forEach(element => {
      if (object[element]) {
        value = object[element];
      }
    });

    return value;
  }

  private getArrayValue(array: Array<any>): any {
    const values = new Array<any>();
    array.forEach(element => {
      if (typeof element != 'object') {
        values.push(element);
      } else {
        values.push(this.getSingleValue(element));
      }
    });
    return values;
  }

}