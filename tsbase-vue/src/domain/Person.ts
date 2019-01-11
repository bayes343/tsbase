import { Pet } from './Pet';

export class Person {
  public firstName = '';
  public lastName = '';
  public age = 0;
  public pets = [new Pet()];

  public complain(): string {
    return 'Life\'s too hard... :(';
  }
}
