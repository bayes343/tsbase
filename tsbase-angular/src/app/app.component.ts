import { Component } from '@angular/core';
import { List, JsonSerializer } from 'tsbase';
import { Person } from './domain/Person';
import { Pet } from './domain/Pet';
import { HttpClient } from 'tsbase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public list = new List<string>(['1', '2', '3']);
  public bayesPets = new List<Pet>([
    { name: 'Freya', kind: 'Dog' },
    { name: 'Loki', kind: 'Cat' },
  ]);
  public people = new List<Person>([
    { lastName: 'Bayes', firstName: 'Tristan', age: 1, pets: this.bayesPets },
    { lastName: 'Beelman', firstName: 'Kiefer', age: 29, },
    { lastName: 'Bayes', firstName: 'Joseph', age: 28, pets: this.bayesPets },
    { lastName: 'Newman', firstName: 'Christopher', age: 29, pets: new List<Pet>([{ name: 'Heidi', kind: 'Dog' }]) },
    { lastName: 'Bayes', firstName: 'Karoline', age: 3, pets: this.bayesPets },
    { lastName: 'Powers', firstName: 'Eric', age: 28, },
    { lastName: 'Bayes', firstName: 'Shauna', age: 28, pets: this.bayesPets },
  ]);
  public itemToAdd: string;
  public itemToRemove: string;
  public itemToFind: string;
  public requestUri = '';
  public requestResponse = '';

  public addItem(): void {
    this.list.Add(this.itemToAdd);
    this.itemToAdd = '';
  }

  public removeItem(): void {
    this.list.Remove(this.itemToRemove);
    this.itemToRemove = '';
  }

  public findIndex(): void {
    alert(`Index is: ${this.list.IndexOf(this.itemToFind)}`);
  }

  public clear(): void {
    this.list.Clear();
  }

  public test(): void {
    const people = new List<Person>([
      new Person('Joseph', 'Bayes'),
      new Person('Eric', 'Powers'),
      new Person('Kiefer', 'Beelman'),
      new Person('Christopher', 'Newman')
    ]);
    people.Sort(item => item.lastName);

    console.log('People sorted by last name whose first name has at least 5 characters.');
    const filteredlist = people.FindAll(item => item.firstName.length >= 5);
    console.log(filteredlist);

    console.log(`Unfiltered list contains Eric: ${people.Contains(new Person('Eric', 'Powers'))}`);
    console.log(`Filtered list contains Eric: ${filteredlist.Exists(item => item.firstName === 'Eric')}`);
    console.log(`All last names have at least 5 characters: ${people.TrueForAll(item => item.lastName.length >= 5)}`);
    console.log(`All first names have at least 5 characters: ${people.TrueForAll(item => item.firstName.length >= 5)}`);

    console.log('Inserting Shauna into list at position 2 / index 1');
    people.Insert(1, new Person('Shauna', 'Bayes'));

    console.log('Adding pets to Joey, Shauna, and Newman');
    const bayesPets = new List<Pet>([new Pet('Loki', 'Cat'), new Pet('Freya', 'Dog')]);
    const joey = people.Find(item => item.firstName === 'Joseph');
    joey.pets = bayesPets;
    const shauna = people.Find(item => item.firstName === 'Shauna');
    shauna.pets = bayesPets;
    const newman = people.Find(item => item.lastName === 'Newman');
    newman.pets = new List<Pet>([new Pet('Heidi', 'Dog')]);

    console.log('Logging all people');
    people.ForEach(item => {
      item.friends = new List<Person>(people.Item);
      console.log(item);
    });

    console.log('Removing the last person in the people list');
    people.RemoveAt(people.Count - 1);
    console.log(people);
  }

  public customSort(): void {
    this.people.InsertRange(2, new List<Person>([
      new Person('Jeb', 'Schiefer', 26),
      new Person('Johnathon', 'Kalbaugh', 40),
      new Person('Jim', 'Driscoll', 45),
      new Person('Kory', 'Koch', 30)
    ]));

    const kory = this.people.Find(item => item.firstName === 'Kory');
    this.people.Remove(kory);

    const jimIndex = this.people.FindIndex(item => item.firstName === 'Jim');
    this.people.RemoveAt(jimIndex);

    const query = this.people
      .Take(5)
      .Where(item => item.lastName.startsWith('B'))
      .OrderBy([
        item => item.age,
        item => item.firstName
      ]);
    this.people = query.ToList();

    this.people.Reverse();
  }

  public async testHttpClient() {
    const client = new HttpClient();
    client.BaseAddress = 'https://foaas.com';
    const uri = this.requestUri;
    const response = await client.GetAsync(uri);
    this.requestResponse = response.Content;
  }

  public testSerializer(): void {
    // tslint:disable-next-line:max-line-length
    const stubUserDrupalResponse = { 'node': { 'uid': [{ 'value': 1 }], 'uuid': [{ 'value': 'c3fba15b-5ac1-423c-8bca-43455b157053' }], 'langcode': [{ 'value': 'en' }], 'preferred_langcode': [{ 'value': 'en' }], 'preferred_admin_langcode': [], 'name': [{ 'value': 'jwbayes' }], 'mail': [{ 'value': 'joseph.w.bayes@outlook.com' }], 'timezone': [{ 'value': 'America\/New_York' }], 'status': [{ 'value': true }], 'created': [{ 'value': '2018-01-25T16:23:59+00:00', 'format': 'Y-m-d\\TH:i:sP' }], 'changed': [{ 'value': '2018-01-25T16:27:54+00:00', 'format': 'Y-m-d\\TH:i:sP' }], 'access': [{ 'value': '2018-04-29T04:16:56+00:00', 'format': 'Y-m-d\\TH:i:sP' }], 'login': [{ 'value': '2018-04-27T17:14:21+00:00', 'format': 'Y-m-d\\TH:i:sP' }], 'init': [{ 'value': 'joseph.w.bayes@outlook.com' }], 'roles': [{ 'target_id': 'administrator', 'target_type': 'user_role', 'target_uuid': '1e6632cf-40bf-454b-84f6-9a39fccb8b82' }], 'default_langcode': [{ 'value': true }], 'path': [{ 'alias': 'profile/jwbayes', 'pid': 123, 'langcode': 'en' }], 'field_display_name': [{ 'value': 'Joey Bayes' }], 'field_employee_id': [{ 'value': '78749' }], 'field_given_name': [{ 'value': 'Joseph' }], 'field_mobile': [{ 'value': '5402675986' }], 'field_surname': [{ 'value': 'Bayes' }], 'number_list': [{ 'value': 1 }, { 'value': 2 }, { 'value': 3 }] } };
    const serializer = new JsonSerializer<User>();
    const user = serializer.Serialize(User, stubUserDrupalResponse.node);
    console.log(user);
  }
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
