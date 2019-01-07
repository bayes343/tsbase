import { HttpClient } from "../HttpClient";

describe('HttpClient', () => {
  let classUnderTest: HttpClient;

  beforeEach(() => {
    classUnderTest = new HttpClient();
    classUnderTest.BaseAddress = "";
  });

  it('should get async', async () => {
    const uri = 'https://foaas.com/cup/Joey';
    const response = await classUnderTest.GetAsync(uri);
    console.log(response);
  });
});

