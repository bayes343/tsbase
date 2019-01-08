import { List } from 'tsbase';
import { Pet } from './Pet';

export class Person {
  constructor(
    public firstName: string,
    public lastName: string,
    public age?: number,
    public friends?: List<Person>,
    public pets?: List<Pet>
  ) { }
}
