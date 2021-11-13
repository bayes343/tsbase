import { Regex } from '../System/Regex';
import { Strings } from '../System/Strings';
import { MetadataKeys } from './Decorators/MetadataLabels';
import { InputTypes } from './InputTypes';

export abstract class Model {
  public static Metadata: Record<string, Record<string, string>> = {};

  public Label<T>(member: (func: T) => any): string {
    const key = Model.getKeyFromMemberFunc(member);
    const labelKey = `${this.constructor.name}-${key}`;
    return Model.Metadata[MetadataKeys.Label]?.[labelKey] || key;
  }

  public Input<T>(member: (func: T) => any): string {
    const key = Model.getKeyFromMemberFunc(member);
    const inputKey = `${this.constructor.name}-${key}`;
    return Model.Metadata[MetadataKeys.Input]?.[inputKey] || InputTypes.Text;
  }

  private static getKeyFromMemberFunc(member: (func: any) => any): string {
    try {
      return member.toString().split('.')[1].replace(Regex.NonAlphaNumeric, '').trim();
    } catch {
      return Strings.Empty;
    }
  }
}
