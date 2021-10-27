import { Mock, Times } from 'tsmockit';
import { IHttpClient } from '../../../Net/Http/IHttpClient';
import { CachedHttpClient } from '../CachedHttpClient';
import { ICache } from '../../Cache/module';
import { Strings } from '../../../System/Strings';

describe('CachedHttpClient', () => {
  let classUnderTest: IHttpClient;
  const mockCache = new Mock<ICache<Response>>();
  const testUri = 'https://foaas.com/cup/joe';
  let responsesResolved = 0;

  const mockFetch = (_uri: RequestInfo, _init?: RequestInit) => {
    return new Promise<any>((resolve) => resolve({
      headers: new Map(),
      json: () => { },
      text: () => Strings.Empty,
      clone: () => { },
      ok: true,
      status: 200
    }));
  };

  beforeEach(() => {
    mockCache.Setup(c => c.Add(testUri, {} as Response));
    mockCache.Setup(c => c.Get(testUri), null);

    responsesResolved = 0;
    classUnderTest = new CachedHttpClient(mockCache.Object, {}, mockFetch);
    classUnderTest.OnResponseResolved = () => responsesResolved++;
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
    expect(new CachedHttpClient(mockCache.Object)).toBeDefined();
  });

  it('should make a request and cache the response if the method is get', async () => {
    const response = await classUnderTest.Get(testUri);

    expect(response.ok).toBeTruthy();
    expect(response.status).toEqual(200);
    expect(responsesResolved).toEqual(1);
  });

  it('should return cached responses when available with in memory cache', async () => {
    mockCache.Setup(c => c.Get(testUri), {
      headers: new Map(),
      ok: true,
      status: 200,
      text: () => Strings.Empty
    } as unknown as Response);

    const response = await classUnderTest.Get(testUri);

    expect(response.ok).toBeTruthy();
    expect(response.status).toEqual(200);
    expect(responsesResolved).toEqual(0);
  });

  it('should not cache a request made with a method other than get', async () => {
    await classUnderTest.Post(testUri, {});
    await classUnderTest.Put(testUri, {});
    await classUnderTest.Patch(testUri, {});
    await classUnderTest.Delete(testUri, {});

    mockCache.Verify(c => c.Add(testUri, {} as Response), Times.Never);
  });
});
