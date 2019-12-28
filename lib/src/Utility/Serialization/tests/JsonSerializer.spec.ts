import { JsonSerializer } from '../JsonSerializer';
import { stubLoanResponse } from './stubLoanResponse';
import { List } from '../../../Collections/List';
import { Strings } from '../../../Constants/Strings';

//#region Fake classes for testing
export class AmortizationSchedule {
  public indexNumber = 0;
  public beginningBalance = 0;
  public interest = 0;
  public principal = 0;
  public endingBalance = 0;
}

export enum LoanFrequency {
  Yearly = 1,
  Monthly = 12,
  Weekly = 52
}

export class LoanItem {
  public principalAmount = 0;
  public numberOfPayments = 0;
  public interestRate = 0;
  public paymentAmount = 0;
  public loanFrequency: LoanFrequency = 12;
}

export class ValidationResultsItem {
  public argument = Strings.Empty;
  public message = Strings.Empty;
}

export class LoanResults {
  public paymentAmount = 0;
  public totalInterest = 0;
  public totalCost = 0;
  public totalPrincipal = 0;
  public amortizationMonthlySchedule = [new AmortizationSchedule()];
  public amortizationYearlySchedule = [new AmortizationSchedule()];
  public loanItem = new LoanItem();
  public validationResultsItemList = [new ValidationResultsItem()];
}

class Pet {
  public name = Strings.Empty;
  public breed = Strings.Empty;
}

class FakeField {
  public one = 'one';
  public two = 'two';
}

class Person {
  public FirstName = Strings.Empty;
  public LastName = Strings.Empty;
  public Age = 0;
  public Titles = new List<string>();
  public Pets = new List<Pet>([new Pet()]);
  public ArrayPets = [new Pet()];
  public FakeField = new FakeField();
}

class Path {
  public alias = Strings.Empty;
  public pid = Strings.Empty;
  public langcode = Strings.Empty;
}

class User {
  public uid = 0;
  public name = Strings.Empty;
  public mail = Strings.Empty;
  public givenName = Strings.Empty;
  public surName = Strings.Empty;
  public mobile = Strings.Empty;
  public employeeId = Strings.Empty;
  public displayName = Strings.Empty;
  public path = new Path();
  public numberList = [];
}

class Product {
  public name = Strings.Empty;
  public categories = [Strings.Empty];
}
//#endregion

// tslint:disable-next-line: max-line-length
const stubUserJsonResponse = { 'node': { 'uid': [{ 'value': 1 }], 'fakeField': [], 'uuid': [{ 'value': 'c3fba15b-5ac1-423c-8bca-43455b157053' }], 'langcode': [{ 'value': 'en' }], 'preferred_langcode': [{ 'value': 'en' }], 'preferred_admin_langcode': [], 'name': [{ 'value': 'jwbayes' }], 'mail': [{ 'value': 'joseph.w.bayes@outlook.com' }], 'timezone': [{ 'value': 'America\/New_York' }], 'status': [{ 'value': true }], 'created': [{ 'value': '2018-01-25T16:23:59+00:00', 'format': 'Y-m-d\\TH:i:sP' }], 'changed': [{ 'value': '2018-01-25T16:27:54+00:00', 'format': 'Y-m-d\\TH:i:sP' }], 'access': [{ 'value': '2018-04-29T04:16:56+00:00', 'format': 'Y-m-d\\TH:i:sP' }], 'login': [{ 'value': '2018-04-27T17:14:21+00:00', 'format': 'Y-m-d\\TH:i:sP' }], 'init': [{ 'value': 'joseph.w.bayes@outlook.com' }], 'roles': [{ 'target_id': 'administrator', 'target_type': 'user_role', 'target_uuid': '1e6632cf-40bf-454b-84f6-9a39fccb8b82' }], 'default_langcode': [{ 'value': true }], 'path': [{ 'alias': 'profile/jwbayes', 'pid': 123, 'langcode': 'en' }], 'field_display_name': [{ 'value': 'Joey Bayes' }], 'field_employee_id': [{ 'value': '78749' }], 'field_given_name': [{ 'value': 'Joseph' }], 'field_mobile': [{ 'value': '5402675986' }], 'field_surname': [{ 'value': 'Bayes' }], 'number_list': [{ 'value': 1 }, { 'value': 2 }, { 'value': 3 }] } };

describe('JsonSerializer', () => {
  let classUnderTest: JsonSerializer<any>;

  beforeEach(() => {
    classUnderTest = new JsonSerializer<Person>();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should serialize simple values from json', () => {
    // PascalCase
    let personInstance = classUnderTest.Serialize(Person, {
      FirstName: 'John',
      LastName: 'Doe',
      Age: 30
    });
    expect(personInstance.Age).toEqual(30);

    // camelCase
    personInstance = classUnderTest.Serialize(Person, {
      firstName: 'John',
      lastName: 'Doe',
      age: 30
    });
    expect(personInstance.FirstName).toEqual('John');

    // snake_case
    personInstance = classUnderTest.Serialize(Person, {
      first_name: 'John',
      last_name: 'Doe',
      age: 30
    });
    expect(personInstance.LastName).toEqual('Doe');

    expect(personInstance.FakeField.one).toEqual('one');
  });

  it('should serialized array values from json', () => {
    const pet = {
      name: 'Freya',
      breed: 'GSD'
    };
    const personInstance: Person = classUnderTest.Serialize(Person, {
      FirstName: 'John',
      LastName: 'Doe',
      Age: 30,
      Titles: [
        'Daddy',
        'Software Engineer',
        'Superman',
        'Genius',
        'Tiny god'
      ],
      Pets: [pet],
      ArrayPets: [pet, pet]
    });
    expect(personInstance.Titles.Count).toEqual(5);
    expect(personInstance.Titles.Contains('Daddy')).toBeTruthy();
    expect(personInstance.Pets.FindAll(item => item.name === 'Freya').Count).toEqual(1);
    expect(personInstance.ArrayPets.length).toEqual(2);
    expect(personInstance.ArrayPets[0].name).toEqual('Freya');
  });

  it('should serialize nested classes from complex json', () => {
    classUnderTest = new JsonSerializer<User>();
    const userInstance: User = classUnderTest.Serialize(User, stubUserJsonResponse.node);
    expect(userInstance.path.langcode).toEqual('en');
  });

  it('should serialize a loan response from wbcw', () => {
    classUnderTest = new JsonSerializer<LoanResults>();
    const loanInstance: LoanResults = classUnderTest.Serialize(LoanResults, stubLoanResponse);
    expect(loanInstance.amortizationMonthlySchedule.length).toEqual(60);
    expect(loanInstance.amortizationYearlySchedule.length).toEqual(5);
  });

  it('should serialize small string array values', () => {
    const product = new Product();
    product.name = 'test';
    product.categories = ['toy'];
    const productJson = JSON.stringify(product);

    classUnderTest = new JsonSerializer<Product>();
    const productInstance: Product = classUnderTest.Serialize(Product, JSON.parse(productJson));

    expect(typeof productInstance.categories).toBe('object');
    expect(productInstance.categories.indexOf('toy') >= 0).toBeTruthy();
  });

  it('should parse a json key without acknowledging hyphens, capitalization, or spaces', () => {
    class VerifyResponse {
      public Success = false;
      public ErrorCodes = [''];
    }
    const jsonString = '{\n  "su-cc-ess": false,\n  "e rror-co des": [\n    "missing-input-response",\n    "missing-input-secret"\n  ]\n}';
    const json = JSON.parse(jsonString);
    classUnderTest = new JsonSerializer<VerifyResponse>();

    const verifyResponseInstance: VerifyResponse = classUnderTest.Serialize(VerifyResponse, json);

    expect(verifyResponseInstance.Success).toEqual(false);
    expect(verifyResponseInstance.ErrorCodes.length).toEqual(2);
    expect(verifyResponseInstance.ErrorCodes.indexOf('missing-input-response')).toEqual(0);
    expect(verifyResponseInstance.ErrorCodes.indexOf('missing-input-secret')).toEqual(1);
  });
});
