import { HttpClient, HttpMethod } from '../../Net/Http/module';
import { ICache } from '../Cache/module';

/**
 * An extension of HttpClient that uses a given cache and storage interface
 */
export class CachedHttpClient extends HttpClient {
  constructor(
    private cache: ICache<any>
  ) {
    super();
  }

  protected async getRequestResponse(
    uri: string,
    method: HttpMethod,
    body?: string,
    additionalHeaders?: Record<string, string>
  ): Promise<Response> {
    const getFreshResponse = () => super.getRequestResponse(uri, method, body, additionalHeaders);

    if (method === HttpMethod.Get) {
      const cachedResponse = this.cache.Get(Response, uri);

      if (cachedResponse && cachedResponse.Value) {
        return cachedResponse.Value;
      } else {
        const freshResponse = getFreshResponse();
        this.cache.Add(uri, freshResponse);

        return freshResponse;
      }
    } else {
      return getFreshResponse();
    }
  }
}
