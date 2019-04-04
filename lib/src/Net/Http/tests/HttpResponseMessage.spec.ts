import { HttpResponseMessage } from "../HttpResponseMessage";
import { Errors } from '../../../Errors';

describe('HttpResponseMessage', () => {
  let classUnderTest: HttpResponseMessage;

  beforeEach(() => {
    classUnderTest = new HttpResponseMessage('Stub response', { Code: 200, Text: 'OK' });
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should detect good or bad status code', () => {
    expect(classUnderTest.IsSuccessStatusCode).toBeTruthy();
    classUnderTest = new HttpResponseMessage('Stub 2', { Code: 400, Text: 'Fail' });
    expect(classUnderTest.IsSuccessStatusCode).toBeFalsy();
  });

  it('should EnsureSuccessStatusCode - throwing an exception if false', () => {
    classUnderTest = new HttpResponseMessage('Stub 2', { Code: 400, Text: 'Fail' });

    expect(() => {
      classUnderTest.EnsureSuccessStatusCode();
    }).toThrowError(`${Errors.BadStatusCode} - Status code does not indicate success, and \"EnsureSuccessStatusCode\" was called.`);
  });

});

