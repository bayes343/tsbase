import { HttpClient, HttpMethod } from '../../Net/Http/module';
import { ICache } from '../Cache/module';

/**
 * An extension of HttpClient that uses a given cache and storage interface
 */
export class CachedHttpClient extends HttpClient {
  constructor(
    private cache: ICache<Response>
  ) {
    super();
  }

  public async Request(
    uri: string,
    method: HttpMethod,
    body?: string,
    additionalHeaders?: Record<string, string>
  ): Promise<Response> {
    const getFreshResponse = () => super.Request(uri, method, body, additionalHeaders);

    if (method === HttpMethod.Get) {
      let cachedResponse = this.cache.Get(uri);

      if (cachedResponse) {
        if (typeof cachedResponse === 'string') {
          const jsonResponse = JSON.parse(cachedResponse);
          cachedResponse = new Response(jsonResponse['body']);
        }

        return cachedResponse;
      } else {
        const freshResponse = await getFreshResponse();
        this.cache.Add(uri, freshResponse.clone());

        return freshResponse;
      }
    } else {
      return getFreshResponse();
    }
  }
}
