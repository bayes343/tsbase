import { Regex } from '../System/Regex';
import { Strings } from '../System/Strings';
import { Result } from '../Patterns/Result/Result';
import { IValidation, Validator } from '../Patterns/Validator/module';
import { MetadataKeys } from './MetadataKeys';

const hiddenFields = [
  'IsTemplate'
];

export abstract class Model {
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

  public LabelFor<T>(member: ((func: T) => any) | string): string {
    return this.getMetadata<string>(MetadataKeys.Label, member, typeof member === 'string' ?
      member : Model.GetKeyFromMemberFunc(member));
  }

  public OptionsFor<T>(member: ((func: T) => any) | string): Record<string, string> {
    return this.getMetadata<Record<string, string>>(MetadataKeys.Options, member, {});
  }

  public ValidationsFor<T>(member: ((func: T) => any) | string): Array<IValidation<Model>> {
    return this.getMetadata<Array<IValidation<Model>>>(MetadataKeys.Validations, member, []);
  }

  public Validate<T>(member?: (func: T) => any): Result {
    return member ?
      this.validateField(member) :
      this.validateModel();
  }

  private validateModel(): Result {
    let result = new Result();

    this.ModelKeys.forEach(key => {
      const isDataModel = !!(this as any)[key]['ModelKeys'];
      if (isDataModel) {
        const nestedDataModel = (this as any)[key];
        result = result.CombineWith(nestedDataModel.Validate());
      } else if (this.fieldIsArrayOfDataModel((this as any)[key])) {
        result = this.validateDataModelArray(key, result);
      } else {
        const validations = this.ValidationsFor<Model>(key);
        result = result.CombineWith(new Validator(validations).Validate(this));
      }
    });

    return result;
  }

  private validateDataModelArray(key: string, result: Result) {
    const nestedDataModelArray = (this as any)[key] as Array<Model>;

    nestedDataModelArray.forEach(model => {
      if (!model.IsTemplate) {
        result = result.CombineWith(model.Validate());
      }
    });

    return result;
  }

  private validateField(member: (func: any) => any): Result {
    const validations = this.ValidationsFor(member);
    const validator = new Validator(validations);
    return validator.Validate(this);
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
