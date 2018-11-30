import { Component } from '@angular/core';
import { List } from 'tsdotnet';
import { Person } from './domain/Person';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public list = new List<string>(['1', '2', '3']);
  public itemToAdd: string;
  public itemToRemove: string;
  public itemToFind: string;

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

    console.log('Logging all people');
    people.ForEach(item => {
      console.log(item);
    });

    this.test2();
  }

  public async test2() {
    for (let i = 0; i < 5; i++) {
      const count = await this.delay(500, i);
      console.log(count);
    }
  }

  private delay(milliseconds: number, count: number): Promise<number> {
    return new Promise<number>(resolve => {
      setTimeout(() => {
        resolve(count);
      }, milliseconds);
    });
  }

}
