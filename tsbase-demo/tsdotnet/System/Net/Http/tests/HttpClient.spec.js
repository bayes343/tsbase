import { HttpClient } from "../HttpClient";
describe('HttpClient', () => {
    let classUnderTest;
    beforeEach(() => {
        classUnderTest = new HttpClient();
        classUnderTest.BaseAddress = "";
    });
    it('should get async', () => {
        const uri = 'https://foaas.com/cup/Joey';
        const response = classUnderTest.GetAsync(uri);
        console.log(response);
    });
});
//# sourceMappingURL=HttpClient.spec.js.map