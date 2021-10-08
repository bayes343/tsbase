import { FormUrl } from '../../System/FormUrl';
import { Strings } from '../../System/Strings';

describe('FormUrl', () => {
  const decodedJson = {
    secret: 'secret',
    response: 'response'
  };
  const decodedSingleKeyJson = {
    key: 'value'
  };
  const encodedString = 'secret=secret&response=response';
  const encodedSingleValueString = 'key=value';

  it('should encode json with a single key into form url encoded string', () => {
    const encodeResult = FormUrl.EncodeJson(decodedSingleKeyJson);
    expect(encodeResult).toEqual(encodedSingleValueString);
  });

  it('should encode json with multiple keys into form url encoded string', () => {
    const encodeResult = FormUrl.EncodeJson(decodedJson);
    expect(encodeResult).toEqual(encodedString);
  });

  it('should decode FormUrl encoded string with one key value pair to json', () => {
    const decodedSingleKeyJsonResult = FormUrl.DecodeToJson(encodedSingleValueString);
    expect(decodedSingleKeyJsonResult).toEqual(decodedSingleKeyJson);
  });

  it('should decode FormUrl encoded string with multiple key value pairs to json', () => {
    const decodedJsonResult = FormUrl.DecodeToJson(encodedString);
    expect(decodedJsonResult).toEqual(decodedJson);
  });

  it('should return an empty string when encoding an empty object', () => {
    const encodedEmptyObject = FormUrl.EncodeJson({});
    expect(encodedEmptyObject).toEqual(Strings.Empty);
  });

  it('should return an empty object when decoding an empty string', () => {
    const decodedEmptyString = FormUrl.DecodeToJson('');
    expect(decodedEmptyString).toEqual({});
  });
});
