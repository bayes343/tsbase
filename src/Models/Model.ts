import { Regex } from '../System/Regex';
import { Strings } from '../System/Strings';
import { Result } from '../Patterns/Result/Result';
import { IValidation, Validator } from '../Patterns/Validator/module';
import { MetadataKeys } from './MetadataKeys';

const hiddenFields = [
  'IsTemplate'
];

export abstract class Model<T> {
  public static Metadata: Record<string, Record<string, any>> = {};

  public static GetKeyFromMemberFunc(member: (func: any) => any): string {
    try {
      const postReturnString = member.toString().split('return')[1];
      const splitChar = postReturnString.includes('.') ? '.' : '[';
      return postReturnString.split(splitChar)[1].replace(Regex.NonAlphaNumeric, '').trim();
    } catch {
      return Strings.Empty;
    }
  }

  constructor(public IsTemplate = false) { }

  public get ModelKeys(): Array<string> {
    return Object.keys(this).filter(k => !hiddenFields.includes(k));
  }

  public LabelFor(member: ((func: T) => any) | string): string {
    return this.getMetadata<string>(MetadataKeys.Label, member, typeof member === 'string' ?
      member : Model.GetKeyFromMemberFunc(member));
  }

  public DescriptionFor(member: ((func: T) => any) | string): string {
    return this.getMetadata<string>(MetadataKeys.Description, member, typeof member === 'string' ?
      member : Model.GetKeyFromMemberFunc(member));
  }

  public InputTypeFor(member: ((func: T) => any) | string): string {
    return this.getMetadata<string>(MetadataKeys.InputType, member, typeof member === 'string' ?
      member : Model.GetKeyFromMemberFunc(member));
  }

  public OptionsFor(member: ((func: T) => any) | string): Record<string, string> {
    return this.getMetadata<Record<string, string>>(MetadataKeys.Options, member, {});
  }

  public ValidationsFor(member: ((func: T) => any) | string): Array<IValidation<Model<T>>> {
    return this.getMetadata<Array<IValidation<Model<T>>>>(MetadataKeys.Validations, member, []);
  }

  public Validate(member?: (func: T) => any): Result<null> {
    return member ?
      this.ValidateField(member) :
      this.validateModel();
  }

  public ValidateField(member: (func: any) => any): Result<null> {
    const validations = this.ValidationsFor(member);
    const validator = new Validator(validations);
    return validator.Validate(this);
  }

  private validateModel(): Result<null> {
    let result = new Result(null);

    this.ModelKeys.forEach(key => {
      const isDataModel = !!(this as any)[key]['ModelKeys'];
      if (isDataModel) {
        const nestedDataModel = (this as any)[key];
        result = result.CombineWith(nestedDataModel.Validate());
      } else if (this.fieldIsArrayOfDataModel((this as any)[key])) {
        result = this.validateDataModelArray(key, result);
      } else {
        const validations = this.ValidationsFor(key);
        result = result.CombineWith(new Validator(validations).Validate(this));
      }
    });

    return result;
  }

  private validateDataModelArray(key: string, result: Result<null>) {
    const nestedDataModelArray = (this as any)[key] as Array<Model<T>>;

    nestedDataModelArray.forEach(model => {
      if (!model.IsTemplate) {
        result = result.CombineWith(model.Validate());
      }
    });

    return result;
  }

  private fieldIsArrayOfDataModel(field: any): boolean {
    return typeof field === 'object' && field[0] && field[0]['ModelKeys'];
  }

  private getMetadata<T>(metadataKey: MetadataKeys, member: ((func: any) => any) | string, defaultValue: any): T {
    const key = typeof member === 'string' ? member : Model.GetKeyFromMemberFunc(member);
    const subKey = `${this.constructor.name}-${key}`;
    return Model.Metadata[metadataKey]?.[subKey] || defaultValue;
  }
}
