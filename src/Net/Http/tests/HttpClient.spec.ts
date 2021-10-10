import { IHttpClient } from '../IHttpClient';
import { HttpClient } from '../HttpClient';

describe('HttpClient', () => {
  let classUnderTest: IHttpClient;

  beforeEach(() => {
    classUnderTest = HttpClient.Instance();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });
});
