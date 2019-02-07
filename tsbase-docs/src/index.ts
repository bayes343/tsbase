import { HttpClient, Repository, WebStoragePersister, HttpResponseMessage } from 'tsbase';

(() => {
  const httpClient = new HttpClient();
  const repository = new Repository<HttpResponseMessage>(
    new WebStoragePersister('testApp', 'session')
  );
  let currentResponse: HttpResponseMessage = repository.Count > 0 ? repository.Item[0] : null;

  //#region Control references / Event bindings
  const responseContainer = document.getElementById('responseContainer');
  const responseStatus = document.getElementById('responseStatus');
  const getUriButton = document.getElementById('getUriButton');
  const clearButton = document.getElementById('clearButton');
  const backButton = document.getElementById('backButton');
  const forwardButton = document.getElementById('forwardButton');

  getUriButton.addEventListener('click', setResponseContainer);
  backButton.addEventListener('click', goBack);
  forwardButton.addEventListener('click', goForward);
  clearButton.addEventListener('click', () => {
    responseContainer.innerHTML = "";
    responseStatus.innerText = "";
  });
  //#endregion

  if (currentResponse) {
    setViewForResponse(currentResponse);
  }

  function getUriText(): string {
    return (document.getElementById('uriTextbox') as HTMLInputElement).value;
  }

  async function setResponseContainer(): Promise<any> {
    if (getUriText() == '') {
      return;
    }
    const response = await httpClient.GetAsync(getUriText());
    if (response) {
      currentResponse = response;
      repository.Add(response);
      repository.SaveChanges();

      setViewForResponse(response);
    }
  }

  function setViewForResponse(response: HttpResponseMessage): void {
    responseStatus.innerText = `${response.IsSuccessStatusCode ? 'Success' : 'Failure'} | Status code: ${response.StatusCode.Code}`;
    responseContainer.innerHTML = response.Content;
  }

  function goBack(): void {
    if (currentResponse) {
      const currentIndex = repository.IndexOf(currentResponse);
      if (currentIndex > 0) {
        currentResponse = repository.Item[currentIndex - 1]
        setViewForResponse(currentResponse);
      }
    }
  }

  function goForward(): void {
    if (currentResponse) {
      const currentIndex = repository.IndexOf(currentResponse);
      if (currentIndex < repository.Count - 1) {
        currentResponse = repository.Item[currentIndex + 1]
        setViewForResponse(currentResponse);
      }
    }
  }
})();