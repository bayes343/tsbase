import { ISerializer } from './ISerializer';

const keysToCheck = [
  'value',
  'target_id'
];

export class JsonSerializer<T> implements ISerializer<T> {
  public Serialize(t: { new(): T; }, json: any): T {
    const object: any = new t();

    const classProperties = Object.keys(object);
    const jsonKeys = Object.keys(json);

    jsonKeys.forEach(element => {
      const instanceKey = this.getInstanceKey(classProperties, element);
      const jsonElement = json[element];
      if (instanceKey !== '' && jsonElement) {
        const property = object[instanceKey];

        if (
          Array.isArray(property) && typeof property[0] !== 'object' || typeof property !== 'object'
        ) {
          this.serializeSimpleField(jsonElement, object, instanceKey);
        } else if (Array.isArray(property) && typeof property[0] === 'object') {
          const values = [];
          for (const element of jsonElement) {
            const newSerializer = new JsonSerializer<any>();
            values.push(newSerializer.Serialize(property[0].constructor, element));
          }
          object[instanceKey] = values;
        } else {
          const newSerializer = new JsonSerializer<any>();
          let sourceJson = Array.isArray(jsonElement) ? jsonElement[0] : jsonElement;
          object[instanceKey] = newSerializer.Serialize(property.constructor, sourceJson);
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