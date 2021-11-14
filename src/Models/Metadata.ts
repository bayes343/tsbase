import { IValidation } from '../Patterns/Validator/IValidation';
import { InputTypes } from './InputTypes';
import { Model } from './Model';
import { MetadataKeys } from './MetadataKeys';

function metadata(metadataKey: MetadataKeys, value: any) {
  return function (target: Model, key: string) {
    const metaData = Model.Metadata[metadataKey] ||
      (Model.Metadata[metadataKey] = {});

    metaData[`${target.constructor.name}-${key}`] = value;
  };
}

export function Label(label: string) {
  return metadata(MetadataKeys.Label, label);
}

export function Input(input: InputTypes) {
  return metadata(MetadataKeys.Input, input);
}

export function Options(options: Record<string, string>) {
  return metadata(MetadataKeys.Options, options);
}

export function Validation(validations: Array<IValidation<Model>>) {
  return metadata(MetadataKeys.Validations, validations);
}
