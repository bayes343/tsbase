import { JsonSerializer } from "../JsonSerializer";

class Person {
  public FirstName = '';
  public LastName = '';
  public Age = 0;
  public Titles = new Array<string>();
}

class Path {
  public alias = '';
  public pid = '';
  public langcode = '';
}

class User {
  public uid = 0;
  public name = '';
  public mail = '';
  public givenName = '';
  public surName = '';
  public mobile = '';
  public employeeId = '';
  public displayName = '';
  public path = new Path();
  public numberList = [];
}


const stubUserJsonResponse = { 'node': { 'uid': [{ 'value': 1 }], 'uuid': [{ 'value': 'c3fba15b-5ac1-423c-8bca-43455b157053' }], 'langcode': [{ 'value': 'en' }], 'preferred_langcode': [{ 'value': 'en' }], 'preferred_admin_langcode': [], 'name': [{ 'value': 'jwbayes' }], 'mail': [{ 'value': 'joseph.w.bayes@outlook.com' }], 'timezone': [{ 'value': 'America\/New_York' }], 'status': [{ 'value': true }], 'created': [{ 'value': '2018-01-25T16:23:59+00:00', 'format': 'Y-m-d\\TH:i:sP' }], 'changed': [{ 'value': '2018-01-25T16:27:54+00:00', 'format': 'Y-m-d\\TH:i:sP' }], 'access': [{ 'value': '2018-04-29T04:16:56+00:00', 'format': 'Y-m-d\\TH:i:sP' }], 'login': [{ 'value': '2018-04-27T17:14:21+00:00', 'format': 'Y-m-d\\TH:i:sP' }], 'init': [{ 'value': 'joseph.w.bayes@outlook.com' }], 'roles': [{ 'target_id': 'administrator', 'target_type': 'user_role', 'target_uuid': '1e6632cf-40bf-454b-84f6-9a39fccb8b82' }], 'default_langcode': [{ 'value': true }], 'path': [{ 'alias': 'profile/jwbayes', 'pid': 123, 'langcode': 'en' }], 'field_display_name': [{ 'value': 'Joey Bayes' }], 'field_employee_id': [{ 'value': '78749' }], 'field_given_name': [{ 'value': 'Joseph' }], 'field_mobile': [{ 'value': '5402675986' }], 'field_surname': [{ 'value': 'Bayes' }], 'number_list': [{ 'value': 1 }, { 'value': 2 }, { 'value': 3 }] } };

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
  });

  it('should serialized array values from json', () => {
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
      ]
    });

    expect(personInstance.Titles.length).toEqual(5);
  });

  it('should serialize nested classes from complex json', () => {
    classUnderTest = new JsonSerializer<User>();
    const userInstance: User = classUnderTest.Serialize(User, stubUserJsonResponse.node);
    console.log(userInstance);
    expect(userInstance.path.langcode).toEqual('en');
  });
});

