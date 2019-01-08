import { HttpClient } from "../HttpClient";
import { MockXhrRequestHandler } from './MockXhrRequestHandler';

describe('HttpClient', () => {
  let classUnderTest: HttpClient;

  beforeEach(() => {
    classUnderTest = new HttpClient(new MockXhrRequestHandler(classUnderTest));
    classUnderTest.DefaultRequestHeaders.push({ key: 'Content-Type', value: 'application/json' });
  });

  it('should get async - integration test with included XhrRequestHandler', async () => {
    classUnderTest = new HttpClient();
    classUnderTest.DefaultRequestHeaders.push({ key: 'Content-Type', value: 'application/json' });

    // Ok status check
    const uri = 'https://foaas.com/cup/Joey';
    const response = await classUnderTest.GetAsync(uri);
    expect(response.Content).toBeDefined();
    expect(response.StatusCode.Code).toEqual(200);
    expect(response.IsSuccessStatusCode).toBeTruthy();

    // Bad request check
    const uri2 = 'https://fake-alskjdf/stub';
    const response2 = await classUnderTest.GetAsync(uri2);
    expect(response2.StatusCode.Code).toEqual(400);
    expect(response2.IsSuccessStatusCode).toBeFalsy();
  });

  it('should allow base address setting', async () => {
    classUnderTest.BaseAddress = 'https://fake.com';
    const uri = 'ok';
    const response = await classUnderTest.GetAsync(uri);
    expect(response.StatusCode.Code).toEqual(200);
  });
});

