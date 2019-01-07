export class HttpClient {
  /**
   * Gets or sets the base address of Uniform Resource Identifier (URI) of the Internet resource used when sending requests.
   */
  public BaseAddress: string = '';
  /**
   * Gets the headers which should be sent with each request.
   */
  public DefaultRequestHeaders: Array<{ key: string, value: string }> = [];
  /**
   * Gets or sets the maximum number of bytes to buffer when reading the response content.
   */
  public MaxResponseContentBufferSize: number = 0;
  /**
   * Gets or sets the time in seconds to wait before the request times out.
   */
  public Timeout: number = 10;

  public CancelPendingRequests() {
    throw new Error('CancelPendingRequests not yet implemented');
  }

  public DeleteAsync() {
    throw new Error('DeleteAsync not yet implemented');
  }

  public Dispose() {
    throw new Error('Dispose not yet implemented');
  }

  /**
   * Send a GET request to the specified Uri as an asynchronous operation.
   * @param uri 
   */
  public async GetAsync(uri: string): Promise<any> {
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      uri = this.BaseAddress ? `${this.BaseAddress}/${uri}` : uri;
      xhr.open("GET", uri, true);
      xhr.onload = () => resolve(xhr.responseText);
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send();
    });
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

  //#region Helpers
  private getXhrRequest(): XMLHttpRequest {
    var xhr = new XMLHttpRequest();
    xhr.timeout = this.Timeout * 1000;
    this.DefaultRequestHeaders.forEach(element => {
      xhr.setRequestHeader(element.key, element.value);
    });
    return xhr;
  }
  //#endregion

}