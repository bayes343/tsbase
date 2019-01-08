import { HttpStatusCode } from '../HttpStatusCode';

export class HttpResponseMessage {
  public IsSuccessStatusCode = false;
  public Headers = new Array<{ name: string, value: string }>();

  constructor(
    public Content: string,
    public StatusCode: HttpStatusCode
  ) {
    this.IsSuccessStatusCode = this.StatusCode.Code < 400;
  }
}