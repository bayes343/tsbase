/* eslint-disable max-lines */
import { Logger } from '../../Logger/module';
import { CacheModes, PWA } from '../PWA';

describe('PWA', () => {
  let requestsMade: any[] = [];
  let responses: any[] = [];
  let classUnderTest: PWA;
  const fakeFetch = (req) => {
    requestsMade.push(req);
    return responses.shift();
  };

  beforeAll(() => {
    globalThis.fetch = fakeFetch;
  });

  beforeEach(() => {
    requestsMade = [];
    responses = [];
    classUnderTest = new PWA('Test', '0.0.1');
  });

  it('EnableHaptics should throw an error when the window is not defined', () => {
    expect(() => {
      PWA.EnableHaptics(undefined, null as any);
    }).toThrowError('browser context method called in webworker');
  });

  it('EnableHaptics get button and anchors and add click listeners that call vibrate', () => {
    let selectorUsed = '';
    let eventListenerUsed = '';
    let patternUsed = 0;
    let callbackAdded = () => { };

    PWA.EnableHaptics(100, {
      navigator: {
        vibrate: (pattern) => {
          patternUsed = pattern;
        }
      },
      document: {
        querySelectorAll: (selector) => {
          selectorUsed = selector;
          return [{
            addEventListener: (event, cb) => {
              eventListenerUsed = event;
              callbackAdded = cb;
            }
          }];
        }
      }
    } as any);

    expect(selectorUsed).toEqual('a, button');
    expect(eventListenerUsed).toEqual('click');
    callbackAdded();
    expect(patternUsed).toEqual(100);
  });

  it('EnableOfflineCompatibility should throw not implemented exception when "cache first" mode specified', () => {
    expect(() => {
      classUnderTest.EnableOfflineCompatibility({} as any, [], {
        cacheMode: CacheModes.CacheFirst
      });
    }).toThrowError('options.cacheMode "cacheFirst": planned feature not yet implemented');
  });

  it('EnableOfflineCompatibility should throw context error when worker global scope ref not defined', () => {
    expect(() => {
      classUnderTest.EnableOfflineCompatibility(null as any);
    }).toThrowError('webworker context method called in browser');
  });

  it('EnableOfflineCompatibility should add correct event listeners', () => {
    const listeners: any = {};

    classUnderTest.EnableOfflineCompatibility({
      addEventListener: (event, cb) => listeners[event] = cb
    } as any);

    expect(listeners.install).toBeDefined();
    expect(listeners.activate).toBeDefined();
    expect(listeners.fetch).toBeDefined();
  });

  it('cacheFilesCommand called on install event should open a cache with the correct name and version and add static files to cache', async () => {
    let cacheName = '';
    let staticAssets: string[] = [];
    globalThis.caches = {
      open: (name) => {
        cacheName = name;
        return {
          addAll: (sa) => staticAssets = sa
        };
      }
    } as any;
    const listeners: any = {};

    classUnderTest.EnableOfflineCompatibility({
      addEventListener: (event, cb) => listeners[event] = cb
    } as any, [
      '/index.html',
      '/styles.css',
      '/bundle.js'
    ]);

    let waitUntilPromise: Promise<any> = new Promise<void>((r) => r());
    listeners.install({
      waitUntil: (promise: Promise<any>) => waitUntilPromise = promise
    });
    await waitUntilPromise;

    expect(cacheName).toEqual('0.0.1Test');
    expect(staticAssets).toEqual([
      '/index.html',
      '/styles.css',
      '/bundle.js'
    ]);
  });

  it('deleteOldCacheCommand called on activate event should get cached keys and delete them', async () => {
    const deletedKeys: string[] = [];
    globalThis.caches = {
      keys: () => ([
        '/index.html',
        '/styles.css',
        '/bundle.js'
      ]),
      delete: (key) => deletedKeys.push(key)
    } as any;
    const listeners: any = {};

    classUnderTest.EnableOfflineCompatibility({
      addEventListener: (event, cb) => listeners[event] = cb
    } as any);

    let waitUntilPromise: Promise<any> = new Promise<void>((r) => r());
    listeners.activate({
      waitUntil: (promise: Promise<any>) => waitUntilPromise = promise
    });
    await waitUntilPromise;

    expect(deletedKeys).toEqual([
      '/index.html',
      '/styles.css',
      '/bundle.js'
    ]);
  });

  it('handleFetchCommand called on fetch event should handle uncached request', async () => {
    responses = [{
      clone: () => ({})
    }];
    const listeners: any = {};
    classUnderTest.EnableOfflineCompatibility({
      addEventListener: (event, cb) => listeners[event] = cb
    } as any);
    globalThis.caches = {
      open: () => ({
        put: (_req, _cpy) => { }
      })
    } as any;

    let respondedWith: any;
    await listeners.fetch({
      request: {
        method: 'GET',
        url: 'https://www.example.com'
      },
      respondWith: (v) => respondedWith = v
    });
    const resolved = await respondedWith;

    expect(requestsMade).toEqual([{
      method: 'GET',
      url: 'https://www.example.com'
    }]);
    expect(resolved).toBeDefined();
  });

  it('handleFetchCommand called on fetch event should return cached response when network unavailable', async () => {
    const listeners: any = {};
    classUnderTest.EnableOfflineCompatibility({
      addEventListener: (event, cb) => listeners[event] = cb
    } as any);
    globalThis.caches = {
      match: () => ({}),
      open: () => ({
        put: (_req, _cpy) => { }
      })
    } as any;

    let respondedWith: any;
    await listeners.fetch({
      request: {
        method: 'GET',
        url: 'https://www.example.com'
      },
      respondWith: (v) => respondedWith = v
    });
    const resolved = await respondedWith;

    expect(requestsMade).toEqual([{
      method: 'GET',
      url: 'https://www.example.com'
    }]);
    expect(resolved).toBeDefined();
  });

  it('handleFetchCommand called on fetch event should handle raised errors', async () => {
    responses = [{
      clone: () => ({})
    }];
    const listeners: any = {};
    classUnderTest.EnableOfflineCompatibility({
      addEventListener: (event, cb) => listeners[event] = cb
    } as any);
    globalThis.caches = {
      open: () => ({
        put: (_req, _cpy) => { throw new Error('test'); }
      })
    } as any;

    let respondedWith: any;
    await listeners.fetch({
      request: {
        method: 'GET',
        url: 'https://www.example.com'
      },
      respondWith: (v) => respondedWith = v
    });
    await respondedWith;

    expect(Logger.Instance.LogEntries[0].Message).toEqual('Failed to fetch');
  });
});
