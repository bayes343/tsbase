import { MetadataLabels } from './Decorators/MetadataLabels';

export abstract class Model {
  public static Metadata: Record<string, Record<string, string>> = {};
  public GetLabel(key: string): string {
    const labelKey = `${this.constructor.name}-${key}`;
    return Model.Metadata[MetadataLabels.MetadataLabelKey]?.[labelKey] || key;
  }
}
