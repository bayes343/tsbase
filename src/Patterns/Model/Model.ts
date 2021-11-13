import { Regex } from '../../System/Regex';
import { Strings } from '../../System/Strings';
import { MetadataLabels } from './Decorators/MetadataLabels';

export abstract class Model {
  public static Metadata: Record<string, Record<string, string>> = {};

  public Label<T>(member: (func: T) => any): string {
    const key = Model.getKeyFromMemberFunc(member);
    const labelKey = `${this.constructor.name}-${key}`;
    return Model.Metadata[MetadataLabels.MetadataLabelKey]?.[labelKey] || key;
  }

  private static getKeyFromMemberFunc(member: (func: any) => any): string {
    try {
      return member.toString().split('.')[1].replace(Regex.NonAlphaNumeric, '').trim();
    } catch {
      return Strings.Empty;
    }
  }
}
