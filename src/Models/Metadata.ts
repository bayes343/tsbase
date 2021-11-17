import { IValidation } from '../Patterns/Validator/IValidation';
import { Model } from './Model';
import { MetadataKeys } from './MetadataKeys';
import { RequiredValidation, RangeValidation, RegExpValidation, StringLengthValidation, OptionValidation } from './Validations/module';

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

export function Validations(validations: Array<IValidation<Model>>) {
  return function (target: Model, key: string) {
    const metaData = Model.Metadata[MetadataKeys.Validations] ||
      (Model.Metadata[MetadataKeys.Validations] = {});

    const validationMetadata = metaData[`${target.constructor.name}-${key}`];
    metaData[`${target.constructor.name}-${key}`] = validationMetadata ? validationMetadata.concat(validations) : validations;
  };
}

export function Options(options: Record<string, string>, customErrorMessage?: string) {
  return function (target: Model, key: string) {
    Validations([new OptionValidation(key, customErrorMessage)])(target, key);
    metadata(MetadataKeys.Options, options)(target, key);
  };
}

export function Required(customErrorMessage?: string) {
  return function (target: Model, key: string) {
    Validations([new RequiredValidation(key, customErrorMessage)])(target, key);
  };
}

export function Range(minimum: number, maximum: number, customErrorMessage?: string) {
  return function (target: Model, key: string) {
    Validations([new RangeValidation(key, minimum, maximum, customErrorMessage)])(target, key);
  };
}

export function StringLength(minimum: number, maximum: number, customErrorMessage?: string) {
  return function (target: Model, key: string) {
    Validations([new StringLengthValidation(key, minimum, maximum, customErrorMessage)])(target, key);
  };
}

export function RegExp(regex: RegExp, customErrorMessage?: string) {
  return function (target: Model, key: string) {
    Validations([new RegExpValidation(key, regex, customErrorMessage)])(target, key);
  };
}
