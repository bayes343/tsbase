import { Regex } from '../System/Regex';
import { Strings } from '../System/Strings';
import { MetadataKeys } from './Decorators/MetadataKeys';
import { InputTypes } from './InputTypes';

export abstract class Model {
  public static Metadata: Record<string, Record<string, any>> = {};

  public LabelFor<T>(member: (func: T) => any): string {
    return this.getMetadata<string>(MetadataKeys.Label, member, Model.getKeyFromMemberFunc(member));
  }

  public InputFor<T>(member: (func: T) => any): InputTypes {
    return this.getMetadata<InputTypes>(MetadataKeys.Input, member, InputTypes.Text);
  }

  public OptionsFor<T>(member: (func: T) => any): Record<string, string> {
    return this.getMetadata<Record<string, string>>(MetadataKeys.Options, member, {});
  }

  private getMetadata<T>(metadataKey: MetadataKeys, member: (func: any) => any, defaultValue: any): T {
    const key = Model.getKeyFromMemberFunc(member);
    const subKey = `${this.constructor.name}-${key}`;
    return Model.Metadata[metadataKey]?.[subKey] || defaultValue;
  }

  private static getKeyFromMemberFunc(member: (func: any) => any): string {
    try {
      return member.toString().split('.')[1].replace(Regex.NonAlphaNumeric, '').trim();
    } catch {
      return Strings.Empty;
    }
  }
}
