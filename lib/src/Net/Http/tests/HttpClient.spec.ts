import { HttpClient } from '../HttpClient';
import { HttpRequestMessage } from '../HttpRequestMessage';
import { HttpMethod } from '../../HttpMethod';
import { Mock } from 'tsmockit';
import { IXhrRequestHandler } from '../IXhrRequestHandler';
import { HttpResponseMessage } from '../HttpResponseMessage';
import { Strings } from '../../../Constants/Strings';

describe('HttpClient', () => {
  const mockXhrRequestHandler = new Mock<IXhrRequestHandler>();
  const BadRequest = new HttpResponseMessage('BadRequest', { Code: 400, Text: 'BadRequest' });
  const OkRequest = new HttpResponseMessage('OK', { Code: 200, Text: 'OK' });
  let classUnderTest: HttpClient;

  /* eslint-disable max-len */
  function setupMockXhrRequestHander(mockXhrRequestHandler: Mock<IXhrRequestHandler>, OkRequest: HttpResponseMessage, BadRequest: HttpResponseMessage) {
    mockXhrRequestHandler.Setup(x => x.SendXhrRequest('https://fake.com/ok', HttpMethod.GET, Strings.Empty), new Promise<HttpResponseMessage>((resolve) => { resolve(OkRequest); }));
    mockXhrRequestHandler.Setup(x => x.SendXhrRequest('https://fake.com/bad', HttpMethod.GET, Strings.Empty), new Promise<HttpResponseMessage>((resolve) => { resolve(BadRequest); }));
    mockXhrRequestHandler.Setup(x => x.SendXhrRequest('https://fake.com/delete', HttpMethod.DELETE, Strings.Empty), new Promise<HttpResponseMessage>((resolve) => { resolve(OkRequest); }));
    mockXhrRequestHandler.Setup(x => x.SendXhrRequestMessage(new HttpRequestMessage(HttpMethod.GET, 'https://fake.com/ok')), new Promise<HttpResponseMessage>((resolve) => { resolve(OkRequest); }));
    mockXhrRequestHandler.Setup(x => x.SendXhrRequestMessage(new HttpRequestMessage(HttpMethod.GET, 'https://fake.com/bad')), new Promise<HttpResponseMessage>((resolve) => { resolve(BadRequest); }));
    mockXhrRequestHandler.Setup(x => x.SendXhrRequestMessage(new HttpRequestMessage(HttpMethod.GET, 'https://fake.com/delete')), new Promise<HttpResponseMessage>((resolve) => { resolve(OkRequest); }));
    mockXhrRequestHandler.Setup(x => x.AbortPendingRequests(), null);
  }

  beforeEach(() => {
    setupMockXhrRequestHander(mockXhrRequestHandler, OkRequest, BadRequest);

    classUnderTest = new HttpClient(mockXhrRequestHandler.Object);
    classUnderTest.DefaultRequestHeaders.push({ key: 'Content-Type', value: 'application/json' });
    classUnderTest.BaseAddress = 'https://fake.com';
  });

  //#region Integration tests
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

  it('should send request async', async () => {
    const request1 = new HttpRequestMessage(HttpMethod.GET, 'ok');
    const response1 = await classUnderTest.SendAsync(request1);
    expect(response1.StatusCode.Code).toEqual(200);

    const request2 = new HttpRequestMessage();
    request2.RequestUri = 'ok';
    request2.Headers.push({ key: 'fake', value: 'header' });
    const response2 = await classUnderTest.SendAsync(request2);
    expect(response2.Content).toEqual('OK');
  });

});
