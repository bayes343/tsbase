export declare class HttpClient {
    /**
     * Gets or sets the base address of Uniform Resource Identifier (URI) of the Internet resource used when sending requests.
     */
    BaseAddress: string;
    /**
     * Gets the headers which should be sent with each request.
     */
    DefaultRequestHeaders: Array<{
        key: string;
        value: string;
    }>;
    /**
     * Gets or sets the maximum number of bytes to buffer when reading the response content.
     */
    MaxResponseContentBufferSize: number;
    /**
     * Gets or sets the time in seconds to wait before the request times out.
     */
    Timeout: number;
    CancelPendingRequests(): void;
    DeleteAsync(): void;
    Dispose(): void;
    /**
     * Send a GET request to the specified Uri as an asynchronous operation.
     * @param uri
     */
    GetAsync(uri: string): Promise<any>;
    GetByteArrayAsync(): void;
    GetStreamAsync(): void;
    GetStringAsync(): void;
    PatchAsync(): void;
    PostAsync(): void;
    PutAsync(): void;
    SendAsync(): void;
    private getXhrRequest;
}
