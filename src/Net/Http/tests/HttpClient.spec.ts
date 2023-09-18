import { Strings } from '../../../System/Strings';
import { IHttpClient } from '../IHttpClient';
import { HttpClient } from '../HttpClient';
import { HttpMethod } from '../HttpMethod';

class Request {
  constructor(
    public uri: string,
    public init: any
  ) { }
}

globalThis.Request = Request as any;

describe('HttpClient', () => {
  const testUri = 'https://www.fake.com';
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const responseHeaders = new Map();
  let onResponseResolvedFired = false;
  let classUnderTest: IHttpClient;
  let fetchCalledWith: Request | null = null;
  let fetchCalledWithRequestInit: RequestInit | undefined;
  const mockFetch = (request: RequestInfo) => {
    fetchCalledWith = request as any;
    fetchCalledWithRequestInit = (request as unknown as Request).init;
    return new Promise<any>((resolve) => resolve({
      headers: responseHeaders,
      json: () => { },
      text: () => Strings.Empty
    }));
  };

  beforeEach(() => {
    onResponseResolvedFired = false;
    responseHeaders.delete('content-type');
    fetchCalledWith = null;
    fetchCalledWithRequestInit = undefined;
    classUnderTest = new HttpClient(defaultHeaders, mockFetch);
  });

  it('should construct', () => {
    expect(new HttpClient()).toBeDefined();
    expect(classUnderTest).toBeDefined();
  });

  it('should get the response for a uri and return body as text when content-type is not json', async () => {
    const text = await classUnderTest.Get(testUri);

    expect(fetchCalledWith?.uri).toEqual(testUri);
    expect(fetchCalledWithRequestInit?.method).toEqual(HttpMethod.Get);
    expect(text.body).toEqual(Strings.Empty);
  });

  it('should get the response for a uri and return body as json when content-type is json', async () => {
    responseHeaders.set('content-type', 'application/json');

    const json = await classUnderTest.Get(testUri);

    expect(fetchCalledWith?.uri).toEqual(testUri);
    expect(fetchCalledWithRequestInit?.method).toEqual(HttpMethod.Get);
    expect(typeof json).toEqual('object');
  });

  it('should send a patch request to the given uri with the given body and any additional headers', async () => {
    const text = await classUnderTest.Patch(testUri, '', { test: 'test' });

    expect(fetchCalledWith?.uri).toEqual(testUri);
    expect(fetchCalledWithRequestInit?.method).toEqual(HttpMethod.Patch);
    expect(fetchCalledWithRequestInit?.headers).toEqual({ ...defaultHeaders, ...{ test: 'test' } });
    expect(fetchCalledWithRequestInit?.body).toEqual('');
    expect(text.body).toEqual(Strings.Empty);
  });

  it('should send a post request to the given uri with the given body and any additional headers', async () => {
    const text = await classUnderTest.Post(testUri, '', { test: 'test' });

    expect(fetchCalledWith?.uri).toEqual(testUri);
    expect(fetchCalledWithRequestInit?.method).toEqual(HttpMethod.Post);
    expect(fetchCalledWithRequestInit?.headers).toEqual({ ...defaultHeaders, ...{ test: 'test' } });
    expect(fetchCalledWithRequestInit?.body).toEqual('');
    expect(text.body).toEqual(Strings.Empty);
  });

  it('should send a put request to the given uri with the given body and any additional headers', async () => {
    const text = await classUnderTest.Put(testUri, '', { test: 'test' });

    expect(fetchCalledWith?.uri).toEqual(testUri);
    expect(fetchCalledWithRequestInit?.method).toEqual(HttpMethod.Put);
    expect(fetchCalledWithRequestInit?.headers).toEqual({ ...defaultHeaders, ...{ test: 'test' } });
    expect(fetchCalledWithRequestInit?.body).toEqual('');
    expect(text.body).toEqual(Strings.Empty);
  });

  it('should send a delete request to the given uri with the given body and any additional headers', async () => {
    const text = await classUnderTest.Delete(testUri, { test: 'test' });

    expect(fetchCalledWith?.uri).toEqual(testUri);
    expect(fetchCalledWithRequestInit?.method).toEqual(HttpMethod.Delete);
    expect(fetchCalledWithRequestInit?.headers).toEqual({ ...defaultHeaders, ...{ test: 'test' } });
    expect(text.body).toEqual(Strings.Empty);
  });

  it('should fire on response resolved function', async () => {
    expect(onResponseResolvedFired).toBeFalsy();
    classUnderTest.OnResponseResolved = () => onResponseResolvedFired = true;

    await classUnderTest.Get(testUri);

    expect(onResponseResolvedFired).toBeTruthy();
  });
});
