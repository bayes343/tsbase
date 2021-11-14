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

export function Validation(validations: Array<{ new(member: string): IValidation<Model> }>) {
  return function (target: Model, key: string) {
    const validationInstances = validations.map(v => new v(key));
    const metaData = Model.Metadata[MetadataKeys.Validations] ||
      (Model.Metadata[MetadataKeys.Validations] = {});

    metaData[`${target.constructor.name}-${key}`] = validationInstances;
  };
}
