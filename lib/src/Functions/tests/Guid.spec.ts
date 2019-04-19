import { Guid } from '../Guid';

describe('Guid', () => {

  it('should return a new guid', () => {
    const guid1 = Guid.NewGuid();
    const guid2 = Guid.NewGuid();

    expect(guid1).toBeDefined();
    expect(guid2).toBeDefined();
    expect(guid1 === guid2).toBeFalsy();
  });

});
