import { Model } from '../Model';
import { MetadataLabels } from './MetadataLabels';


export function Label(label: string) {
  return function (target: Model, key: string) {
    const metaData = Model.Metadata[MetadataLabels.MetadataLabelKey] ||
      (Model.Metadata[MetadataLabels.MetadataLabelKey] = {});

    metaData[`${target.constructor.name}-${key}`] = label;
  };
}
