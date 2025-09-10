import { IValidation } from '../Patterns/Validator/IValidation';
import { Model } from './Model';
import { MetadataKeys } from './MetadataKeys';
import { RequiredValidation, RangeValidation, RegExpValidation, StringLengthValidation, OptionValidation } from './Validations/module';
import { InputTypes } from './inputTypes';

function metadata(metadataKey: MetadataKeys, value: any) {
  return function (_, member: ClassFieldDecoratorContext) {
    member.addInitializer(function () {
      const metaData = Model.Metadata[metadataKey] || (Model.Metadata[metadataKey] = {});
      const className = (this as any).constructor.name;
      metaData[`${className}-${String(member.name)}`] = value;
    });
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
  return function (_, member: ClassFieldDecoratorContext) {
    member.addInitializer(function () {
      const metaData = Model.Metadata[MetadataKeys.Validations] || (Model.Metadata[MetadataKeys.Validations] = {});
      const className = (this as any).constructor.name;
      const memberName = String(member.name);
      const validationMetadata: IValidation<unknown>[] = metaData[`${className}-${memberName}`] || [];
      validations = validations.filter(v => !validationMetadata.find(existing => JSON.stringify(v) === JSON.stringify(existing)));
      metaData[`${className}-${memberName}`] = validationMetadata.concat(validations);
    });
  };
}

export function Options(options: Record<string, string>, customErrorMessage?: string) {
  return function (_, member: ClassFieldDecoratorContext) {
    const memberName = String(member.name);
    Validations([new OptionValidation(memberName, customErrorMessage)])(_, member);
    metadata(MetadataKeys.Options, options)(_, member);
  };
}

export function Required(customErrorMessage?: string) {
  return function (_, member: ClassFieldDecoratorContext) {
    Validations([new RequiredValidation(String(member.name), customErrorMessage)])(_, member);
  };
}

export function Range(minimum: number, maximum: number, customErrorMessage?: string) {
  return function (_, member: ClassFieldDecoratorContext) {
    Validations([new RangeValidation(String(member.name), minimum, maximum, customErrorMessage)])(_, member);
  };
}

export function StringLength(minimum: number, maximum: number, customErrorMessage?: string) {
  return function (_, member: ClassFieldDecoratorContext) {
    Validations([new StringLengthValidation(String(member.name), minimum, maximum, customErrorMessage)])(_, member);
  };
}

export function RegExp(regex: RegExp, customErrorMessage?: string) {
  return function (_, member: ClassFieldDecoratorContext) {
    Validations([new RegExpValidation(String(member.name), regex, customErrorMessage)])(_, member);
  };
}
