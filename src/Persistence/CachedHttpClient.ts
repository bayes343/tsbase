import { HttpClient } from '../Net/Http/HttpClient';
import { Repository } from './Repository';
import { HttpResponseMessage } from '../Net/Http/HttpResponseMessage';
import { WebStoragePersister } from './Persisters/WebStoragePersister';
import { Strings } from '../Functions/Strings';

class HttpUriResponse {
  constructor(
    public requestUri = Strings.Empty
  ) { }
  public httpResponse = new HttpResponseMessage(Strings.Empty, { Code: 400, Text: 'Bad Request' });
}

/**
 * HttpClient wrapper that offers baked in caching of HttpResponseMessages through the usage of a Repository.
 * Eliminates the need for a client / server handshake to "GET" previously requested data.
 */
export class CachedHttpClient {
  constructor(
    private httpClient: HttpClient = new HttpClient(),
    private repository: Repository<HttpUriResponse> = Repository.New<HttpUriResponse>(
      new WebStoragePersister('CachedHttpClient', 'session')
    )
  ) { }

  /**
   * Asyncronously get the HttpResponseMessage returned by an Http Get to the request uri.
   * Uses the previously persisted response if available without making an http request.
   * @param uri
   * @param fresh
   */
  public async GetAsync(uri: string, fresh = false): Promise<HttpResponseMessage> {
    const cachedResponse = this.repository.find(item => item.requestUri === uri);
    if (cachedResponse && !fresh) {
      return cachedResponse.httpResponse;
    } else {
      const uriResponse = new HttpUriResponse(uri);
      uriResponse.httpResponse = await this.httpClient.GetAsync(uri);
      this.repository.push(uriResponse);
      this.repository.SaveChanges();
      return uriResponse.httpResponse;
    }
  }
}
