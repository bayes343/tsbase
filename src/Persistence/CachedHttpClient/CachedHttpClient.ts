import { HttpClient, HttpMethod } from '../../Net/Http/module';
import { IGenericStorage } from '../module';

/**
 * An extension of HttpClient that uses a given storage interface to cache GET requests
 */
export class CachedHttpClient extends HttpClient {
  constructor(
    private storage: IGenericStorage
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
      const cachedResponse = this.storage.Get(Response, uri);

      if (cachedResponse && cachedResponse.Value) {
        return cachedResponse.Value;
      } else {
        const freshResponse = getFreshResponse();
        this.storage.Set(uri, freshResponse);

        return freshResponse;
      }
    } else {
      return getFreshResponse();
    }
  }
}
