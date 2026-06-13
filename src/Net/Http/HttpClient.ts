import { IHttpClient, RestResponse } from './IHttpClient';
import { HttpMethod } from './HttpMethod';

export type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export class HttpClient implements IHttpClient {
  public OnRequestReceived?: ((request: Request) => Promise<Response | Request>) | undefined;
  public OnResponseResolved?: (response: Response) => void;
  /**
   * Amount of time before aborting a request, defaults to 30 seconds
   */
  public RequestTimeout = 30000;

  constructor(
    public DefaultRequestHeaders: Record<string, string> = {},
    protected fetchRef: Fetch = globalThis.fetch?.bind(globalThis)
  ) { }

  public async Request(
    uri: string,
    method: HttpMethod,
    body?: string,
    additionalHeaders?: Record<string, string>
  ): Promise<Response> {
    /**
     * @security SSRF (CWE-918): The uri parameter accepts any URL without validation.
     * Assessment - Acceptable Risk (Joseph Bayes 20260613)
     *
     * The intent of this class is to be a general use client for any system.
     * Validation, would be inappropriate and limiting. Consumers could, if
     * they choose, implement validation via the OnRequestReceived handler.
     */
    const request = new Request(uri, {
      method,
      body,
      headers: { ...this.DefaultRequestHeaders, ...additionalHeaders },
      signal: AbortSignal.timeout(this.RequestTimeout)
    });

    const requestOrResponse = await this.OnRequestReceived?.(request);
    const response = requestOrResponse && requestOrResponse instanceof Response ?
      requestOrResponse :
      await this.fetchRef(request);

    this.OnResponseResolved?.(response);

    return response;
  }

  public async Get<T>(uri: string, additionalHeaders?: Record<string, string>): Promise<RestResponse<T>> {
    return await this.getRestResponse(uri, HttpMethod.Get, undefined, additionalHeaders);
  }

  public async Patch<T>(uri: string, body?: string, additionalHeaders?: Record<string, string>): Promise<RestResponse<T>> {
    return await this.getRestResponse(uri, HttpMethod.Patch, body, additionalHeaders);
  }

  public async Post<T>(uri: string, body?: string, additionalHeaders?: Record<string, string>): Promise<RestResponse<T>> {
    return await this.getRestResponse(uri, HttpMethod.Post, body, additionalHeaders);
  }

  public async Put<T>(uri: string, body?: string, additionalHeaders?: Record<string, string>): Promise<RestResponse<T>> {
    return await this.getRestResponse(uri, HttpMethod.Put, body, additionalHeaders);
  }

  public async Delete<T>(uri: string, additionalHeaders?: Record<string, string>): Promise<RestResponse<T>> {
    return await this.getRestResponse(uri, HttpMethod.Delete, undefined, additionalHeaders);
  }

  private async getRestResponse<T>(
    uri: string,
    method: HttpMethod,
    body?: string,
    additionalHeaders?: Record<string, string>
  ): Promise<RestResponse<T>> {
    const response = await this.Request(uri, method, body, additionalHeaders);
    const isJson = response.headers.get('content-type')?.includes('application/json');

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      body: isJson ? await response.json() : await response.text()
    };
  }
}
