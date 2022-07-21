import { IValidation } from '../Patterns/Validator/IValidation';
import { Model } from './Model';
import { MetadataKeys } from './MetadataKeys';
import { RequiredValidation, RangeValidation, RegExpValidation, StringLengthValidation, OptionValidation } from './Validations/module';
import { InputTypes } from './inputTypes';

function metadata<T>(metadataKey: MetadataKeys, value: any) {
  return function (target: Model<T>, key: string) {
    const metaData = Model.Metadata[metadataKey] ||
      (Model.Metadata[metadataKey] = {});

    metaData[`${target.constructor.name}-${key}`] = value;
  };
}

export function Label(label: string) {
  return metadata(MetadataKeys.Label, label);
}

export function Description(description: string) {
  return metadata(MetadataKeys.Description, description);
}

export function InputType(inputType: InputTypes) {
  return metadata(MetadataKeys.InputType, inputType);
}

export function Validations<T>(validations: Array<IValidation<Model<T>>>) {
  return function (target: Model<T>, key: string) {
    const metaData = Model.Metadata[MetadataKeys.Validations] ||
      (Model.Metadata[MetadataKeys.Validations] = {});

    const validationMetadata = metaData[`${target.constructor.name}-${key}`];
    metaData[`${target.constructor.name}-${key}`] = validationMetadata ? validationMetadata.concat(validations) : validations;
  };
}

export function Options<T>(options: Record<string, string>, customErrorMessage?: string) {
  return function (target: Model<T>, key: string) {
    Validations([new OptionValidation(key, customErrorMessage)])(target, key);
    metadata(MetadataKeys.Options, options)(target, key);
  };
}

export function Required<T>(customErrorMessage?: string) {
  return function (target: Model<T>, key: string) {
    Validations([new RequiredValidation(key, customErrorMessage)])(target, key);
  };
}

export function Range<T>(minimum: number, maximum: number, customErrorMessage?: string) {
  return function (target: Model<T>, key: string) {
    Validations([new RangeValidation(key, minimum, maximum, customErrorMessage)])(target, key);
  };
}

export function StringLength<T>(minimum: number, maximum: number, customErrorMessage?: string) {
  return function (target: Model<T>, key: string) {
    Validations([new StringLengthValidation(key, minimum, maximum, customErrorMessage)])(target, key);
  };
}

export function RegExp<T>(regex: RegExp, customErrorMessage?: string) {
  return function (target: Model<T>, key: string) {
    Validations([new RegExpValidation(key, regex, customErrorMessage)])(target, key);
  };
}
