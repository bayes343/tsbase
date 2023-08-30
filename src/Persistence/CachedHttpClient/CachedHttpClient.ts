import { Fetch, HttpClient, HttpMethod } from '../../Net/Http/module';
import { ICache } from '../Cache/module';

/**
 * An extension of HttpClient that uses a given cache and storage interface
 */
export class CachedHttpClient extends HttpClient {
  /**
   * @param cache Currently only compatible with in memory storage driven caches
   */
  constructor(
    private cache: ICache<Response>,
    public DefaultRequestHeaders: Record<string, string> = {},
    protected fetchRef: Fetch = globalThis.fetch?.bind(globalThis)
  ) {
    super(DefaultRequestHeaders, fetchRef);
  }

  public async Request(
    uri: string,
    method: HttpMethod,
    body?: string,
    additionalHeaders?: Record<string, string>
  ): Promise<Response> {
    const getFreshResponse = () => super.Request(uri, method, body, additionalHeaders);

    if (method === HttpMethod.Get) {
      let response = this.cache.Get(uri);

      if (!response) {
        response = await getFreshResponse();
        this.cache.Add(uri, response.clone());
      }

      return response;
    } else {
      return getFreshResponse();
    }
  }
}
