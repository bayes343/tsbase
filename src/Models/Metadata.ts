import { IValidation } from '../Patterns/Validator/IValidation';
import { InputTypes } from './InputTypes';
import { Model } from './Model';
import { MetadataKeys } from './MetadataKeys';
import { RequiredValidation } from './Validations/module';
import { RangeValidation } from './Validations/RangeValidation';

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

function validation(validations: Array<IValidation<Model>>) {
  return function (target: Model, key: string) {
    const metaData = Model.Metadata[MetadataKeys.Validations] ||
      (Model.Metadata[MetadataKeys.Validations] = {});

    const validationMetadata = metaData[`${target.constructor.name}-${key}`];
    metaData[`${target.constructor.name}-${key}`] = validationMetadata ? validationMetadata.concat(validations) : validations;
  };
}

export function Required() {
  return function (target: Model, key: string) {
    validation([new RequiredValidation(key)])(target, key);
  };
}

export function Range(minimum: number, maximum: number) {
  return function (target: Model, key: string) {
    validation([new RangeValidation(key, minimum, maximum)])(target, key);
  };
}
