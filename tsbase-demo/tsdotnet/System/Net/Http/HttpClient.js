import * as tslib_1 from "tslib";
export class HttpClient {
    constructor() {
        /**
         * Gets or sets the base address of Uniform Resource Identifier (URI) of the Internet resource used when sending requests.
         */
        this.BaseAddress = '';
        /**
         * Gets the headers which should be sent with each request.
         */
        this.DefaultRequestHeaders = [];
        /**
         * Gets or sets the maximum number of bytes to buffer when reading the response content.
         */
        this.MaxResponseContentBufferSize = 0;
        /**
         * Gets or sets the time in seconds to wait before the request times out.
         */
        this.Timeout = 10;
        //#endregion
    }
    CancelPendingRequests() {
        throw new Error('CancelPendingRequests not yet implemented');
    }
    DeleteAsync() {
        throw new Error('DeleteAsync not yet implemented');
    }
    Dispose() {
        throw new Error('Dispose not yet implemented');
    }
    /**
     * Send a GET request to the specified Uri as an asynchronous operation.
     * @param uri
     */
    GetAsync(uri) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", uri, true);
                xhr.onload = () => resolve(xhr.responseText);
                xhr.onerror = () => reject(xhr.statusText);
                xhr.send();
            });
        });
    }
    GetByteArrayAsync() {
        throw new Error('GetByteArrayAsync not yet implemented');
    }
    GetStreamAsync() {
        throw new Error('GetStreamAsync not yet implemented');
    }
    GetStringAsync() {
        throw new Error('GetStringAsync not yet implemented');
    }
    PatchAsync() {
        throw new Error('PatchAsync not yet implemented');
    }
    PostAsync() {
        throw new Error('PostAsync not yet implemented');
    }
    PutAsync() {
        throw new Error('PutAsync not yet implemented');
    }
    SendAsync() {
        throw new Error('SendAsync not yet implemented');
    }
    //#region Helpers
    getXhrRequest() {
        var xhr = new XMLHttpRequest();
        xhr.timeout = this.Timeout * 1000;
        this.DefaultRequestHeaders.forEach(element => {
            xhr.setRequestHeader(element.key, element.value);
        });
        return xhr;
    }
}
//# sourceMappingURL=HttpClient.js.map