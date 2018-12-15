export class HttpClient {
  /**
   * Gets or sets the base address of Uniform Resource Identifier (URI) of the Internet resource used when sending requests.
   */
  public BaseAddress: string = '';
  /**
   * Gets the headers which should be sent with each request.
   */
  public DefaultRequestHeaders: Array<string> = [];
  /**
   * Gets or sets the maximum number of bytes to buffer when reading the response content.
   */
  public MaxResponseContentBufferSize: number = 0;
  /**
   * Gets or sets the timespan to wait before the request times out.
   */
  public Timeout: number = 10;

  constructor() { }

  public CancelPendingRequests() {
    throw new Error('CancelPendingRequests not yet implemented');
  }

  public DeleteAsync() {
    throw new Error('DeleteAsync not yet implemented');
  }

  public Dispose() {
    throw new Error('Dispose not yet implemented');
  }

  public GetAsync() {
    throw new Error('GetAsync not yet implemented');
  }

  public GetByteArrayAsync() {
    throw new Error('GetByteArrayAsync not yet implemented');
  }

  public GetStreamAsync() {
    throw new Error('GetStreamAsync not yet implemented');
  }

  public GetStringAsync() {
    throw new Error('GetStringAsync not yet implemented');
  }

  public PatchAsync() {
    throw new Error('PatchAsync not yet implemented');
  }

  public PostAsync() {
    throw new Error('PostAsync not yet implemented');
  }

  public PutAsync() {
    throw new Error('PutAsync not yet implemented');
  }

  public SendAsync() {
    throw new Error('SendAsync not yet implemented');
  }

}