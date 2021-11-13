import { Model } from '../Model';
import { MetadataKeys } from './MetadataKeys';

export function Options(options: Record<string, string>) {
  return function (target: Model, key: string) {
    const metaData = Model.Metadata[MetadataKeys.Options] ||
      (Model.Metadata[MetadataKeys.Options] = {});

    metaData[`${target.constructor.name}-${key}`] = options;
  };
}
