import { HttpClient } from "../HttpClient";
import { MockXhrRequestHandler } from './MockXhrRequestHandler';

describe('HttpClient', () => {
  let classUnderTest: HttpClient;

  beforeEach(() => {
    classUnderTest = new HttpClient(new MockXhrRequestHandler(classUnderTest));
    classUnderTest.DefaultRequestHeaders.push({ key: 'Content-Type', value: 'application/json' });
    classUnderTest.BaseAddress = 'https://fake.com';
  });

  //#region Integration tests
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


  it('should cancel requests | integration test', () => {
    classUnderTest = new HttpClient();
    const uri = 'https://foaas.com/cup/Joey';
    classUnderTest.GetAsync(uri);
    classUnderTest.CancelPendingRequests();
  });
  //#endregion

  it('should allow base address setting', async () => {
    classUnderTest.BaseAddress = 'https://fake.com';
    const uri = 'ok';
    const response = await classUnderTest.GetAsync(uri);
    expect(response.StatusCode.Code).toEqual(200);
  });

  it('should get string from response GetStringAsync', async () => {
    const response = await classUnderTest.GetStringAsync('ok');
    expect(response).toEqual('OK');
  });

  it('should cancel requests', () => {
    classUnderTest.GetStringAsync('ok');
    classUnderTest.CancelPendingRequests();
  });

  it('should delete async', async () => {
    const response = await classUnderTest.DeleteAsync('delete');
    expect(response.StatusCode.Code).toEqual(200);
  });

  it('should patch async', async () => {
    const response = await classUnderTest.PatchAsync('ok', { fake: 'fake' });
    expect(response.StatusCode.Code).toEqual(200);
  });

  it('should post async', async () => {
    const response = await classUnderTest.PostAsync('ok', { fake: 'fake' });
    expect(response.StatusCode.Code).toEqual(200);
  });

  it('should put async', async () => {
    const response = await classUnderTest.PutAsync('ok', { fake: 'fake' });
    expect(response.StatusCode.Code).toEqual(200);
  });

});

