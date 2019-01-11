import { SpeciesType } from './SpeciesType';

export class Pet {
  public name = '';
  public species = SpeciesType.Dog;

  public call(): string {
    return this.getCall();
  }

  private getCall(): string {
    switch (this.species) {
      case SpeciesType.Cat:
        return 'Meow';
      case SpeciesType.Dog:
        return 'Woof';
      default:
        throw new Error(`No call implemented for species ${this.species}`);
    }
  }
}
