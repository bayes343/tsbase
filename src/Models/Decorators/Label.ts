import { Model } from '../Model';
import { MetadataKeys } from './MetadataKeys';

export function Label(label: string) {
  return function (target: Model, key: string) {
    const metaData = Model.Metadata[MetadataKeys.Label] ||
      (Model.Metadata[MetadataKeys.Label] = {});

    metaData[`${target.constructor.name}-${key}`] = label;
  };
}
