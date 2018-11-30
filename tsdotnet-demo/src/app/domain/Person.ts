import { List } from 'tsdotnet';

export class Person {
  constructor(
    public firstName: string,
    public lastName: string,
    public Friends?: List<Person>,
  ) { }
}
