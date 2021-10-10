import { IHttpClient } from '../IHttpClient';
import { HttpClient } from '../HttpClient';

describe('HttpClient', () => {
  let classUnderTest: IHttpClient;

  beforeEach(() => {
    classUnderTest = HttpClient.Instance();
  });
});
