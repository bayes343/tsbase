import { IHttpClient, RestResponse } from './IHttpClient';
import { HttpMethod } from './HttpMethod';

export type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export class HttpClient implements IHttpClient {
  public OnResponseResolved?: (response: Response) => void;

  constructor(
    public DefaultRequestHeaders: Record<string, string> = {},
    protected fetchRef: Fetch = globalThis.fetch.bind(globalThis)
  ) { }

  public async Request(
    uri: string,
    method: HttpMethod,
    body?: string,
    additionalHeaders?: Record<string, string>
  ): Promise<Response> {
    const response = await this.fetchRef(uri, {
      method: method,
      headers: { ...this.DefaultRequestHeaders, ...additionalHeaders },
      body: body
    });

    this.OnResponseResolved?.(response);

    return response;
  }

  public async Get(uri: string, additionalHeaders?: Record<string, string>): Promise<RestResponse> {
    return await this.getRestResponse(uri, HttpMethod.Get, undefined, additionalHeaders);
  }

  public async Patch(uri: string, body: any, additionalHeaders?: Record<string, string>): Promise<RestResponse> {
    return await this.getRestResponse(uri, HttpMethod.Patch, body, additionalHeaders);
  }

  public async Post(uri: string, body: any, additionalHeaders?: Record<string, string>): Promise<RestResponse> {
    return await this.getRestResponse(uri, HttpMethod.Post, body, additionalHeaders);
  }

  public async Put(uri: string, body: any, additionalHeaders?: Record<string, string>): Promise<RestResponse> {
    return await this.getRestResponse(uri, HttpMethod.Put, body, additionalHeaders);
  }

  public async Delete(uri: string, additionalHeaders?: Record<string, string>): Promise<RestResponse> {
    return await this.getRestResponse(uri, HttpMethod.Delete, undefined, additionalHeaders);
  }

  private async getRestResponse(
    uri: string,
    method: HttpMethod,
    body?: string,
    additionalHeaders?: Record<string, string>
  ): Promise<RestResponse> {
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
