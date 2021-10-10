import { IHttpClient } from './IHttpClient';
import { HttpMethod } from './HttpMethod';

type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export class HttpClient implements IHttpClient {
  private static instance: IHttpClient | null = null;
  public static Instance(fetchRef: Fetch = globalThis.fetch.bind(globalThis)): IHttpClient {
    return HttpClient.instance || (HttpClient.instance = new HttpClient(fetchRef));
  }
  public static Destroy = () => HttpClient.instance = null;

  public DefaultRequestHeaders: Record<string, string> = {};

  private constructor(private fetchRef: Fetch) { }

  public async GetAsync(uri: string, additionalHeaders?: Record<string, string>): Promise<Response> {
    return await this.getRequestResponse(uri, HttpMethod.Get, undefined, additionalHeaders);
  }

  public async PatchAsync(uri: string, body: any, additionalHeaders?: Record<string, string>): Promise<Response> {
    return await this.getRequestResponse(uri, HttpMethod.Patch, body, additionalHeaders);
  }

  public async PostAsync(uri: string, body: any, additionalHeaders?: Record<string, string>): Promise<Response> {
    return await this.getRequestResponse(uri, HttpMethod.Post, body, additionalHeaders);
  }

  public async PutAsync(uri: string, body: any, additionalHeaders?: Record<string, string>): Promise<Response> {
    return await this.getRequestResponse(uri, HttpMethod.Put, body, additionalHeaders);
  }

  public async DeleteAsync(uri: string, additionalHeaders?: Record<string, string>): Promise<Response> {
    const response = await this.getRequestResponse(uri, HttpMethod.Delete, undefined, additionalHeaders);
    return response;
  }

  public async GetStringAsync(uri: string, additionalHeaders?: Record<string, string>): Promise<string> {
    const response = await this.getRequestResponse(uri, HttpMethod.Get, undefined, additionalHeaders);
    return await response.json();
  }

  private async getRequestResponse(
    uri: string,
    method: HttpMethod,
    body?: string,
    additionalHeaders?: Record<string, string>
  ): Promise<Response> {
    return await this.fetchRef(uri, {
      method: method,
      headers: { ...this.DefaultRequestHeaders, ...additionalHeaders },
      body: body
    });
  }
}
