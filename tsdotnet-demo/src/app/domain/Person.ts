import { List } from 'tsdotnet';
import { Pet } from './Pet';

export class Person {
  constructor(
    public firstName: string,
    public lastName: string,
    public friends?: List<Person>,
    public pets?: List<Pet>
  ) { }
}
