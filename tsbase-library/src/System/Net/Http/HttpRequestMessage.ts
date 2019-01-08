import { HttpMethod } from '../HttpMethod';
import { KeyValue } from '../../TypeLiterals';

export class HttpRequestMessage {
  public Content = '';
  public Headers = new Array<KeyValue>();
  public Properties = new Array<KeyValue>();

  constructor(
    public Method = HttpMethod.GET,
    public RequestUri = ''
  ) { }
}