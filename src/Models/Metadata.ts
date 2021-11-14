import { IValidation } from '../Patterns/Validator/IValidation';
import { InputTypes } from './InputTypes';
import { Model } from './Model';
import { MetadataKeys } from './MetadataKeys';
import { RequiredValidation } from './Validations/module';
import { RangeValidation } from './Validations/RangeValidation';
import { RegExpValidation } from './Validations/RegExpValidation';
import { StringLengthValidation } from './Validations/StringLengthValidation';

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

//#region Validations
function validation(validations: Array<IValidation<Model>>) {
  return function (target: Model, key: string) {
    const metaData = Model.Metadata[MetadataKeys.Validations] ||
      (Model.Metadata[MetadataKeys.Validations] = {});

    const validationMetadata = metaData[`${target.constructor.name}-${key}`];
    metaData[`${target.constructor.name}-${key}`] = validationMetadata ? validationMetadata.concat(validations) : validations;
  };
}

export function Required(customErrorMessage?: string) {
  return function (target: Model, key: string) {
    validation([new RequiredValidation(key, customErrorMessage)])(target, key);
  };
}

export function Range(minimum: number, maximum: number, customErrorMessage?: string) {
  return function (target: Model, key: string) {
    validation([new RangeValidation(key, minimum, maximum, customErrorMessage)])(target, key);
  };
}

export function StringLength(minimum: number, maximum: number, customErrorMessage?: string) {
  return function (target: Model, key: string) {
    validation([new StringLengthValidation(key, minimum, maximum, customErrorMessage)])(target, key);
  };
}

export function RegExp(regex: RegExp, customErrorMessage?: string) {
  return function (target: Model, key: string) {
    validation([new RegExpValidation(key, regex, customErrorMessage)])(target, key);
  };
}
//#endregion
