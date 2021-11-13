import { InputTypes } from '../InputTypes';
import { Model } from '../Model';
import { MetadataKeys } from './MetadataLabels';

export function Input(input: InputTypes) {
  return function (target: Model, key: string) {
    const metaData = Model.Metadata[MetadataKeys.Input] ||
      (Model.Metadata[MetadataKeys.Input] = {});

    metaData[`${target.constructor.name}-${key}`] = input;
  };
}
