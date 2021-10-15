import { IHttpClient } from '../IHttpClient';
import { HttpClient } from '../HttpClient';

describe('HttpClient', () => {
  // const testUri = 'https://www.fake.com';
  // const testInit = {
  //   body: 'test',
  //   headers: {
  //     'test': 'test'
  //   }
  // };
  // const expectedHeaders = {
  //   'Content-Type': 'application/json',
  //   'Accept': 'application/json',
  //   'test': 'test'
  // };

  let classUnderTest: IHttpClient;
  // let fetchCalledWithUri: RequestInfo | null = null;
  // let fetchCalledWithRequestInit: RequestInit | undefined;
  // const mockFetch = (uri: RequestInfo, init?: RequestInit) => {
  //   fetchCalledWithUri = uri;
  //   fetchCalledWithRequestInit = init;
  //   return new Promise<any>((resolve) => resolve({ json: () => { } }));
  // };

  beforeEach(() => {
    //   fetchCalledWithUri = null;
    //   fetchCalledWithRequestInit = undefined;
    classUnderTest = new HttpClient();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  // it('should get the response for a uri', async () => {
  //   await classUnderTest.Get(testUri);
  //   expect(fetchCalledWithUri).toEqual(testUri);
  // });
});
