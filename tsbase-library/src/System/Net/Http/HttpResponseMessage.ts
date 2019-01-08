import { List } from '../../Collections/Generic/List';
import { HttpStatusCode } from '../HttpStatusCode';

export class HttpResponseMessage {
  public IsSuccessStatusCode = false;
  public Headers = new List<{ name: string, value: string }>();

  constructor(
    public Content: string,
    public StatusCode: HttpStatusCode
  ) {
    this.IsSuccessStatusCode = this.StatusCode.Code < 400;
  }
}