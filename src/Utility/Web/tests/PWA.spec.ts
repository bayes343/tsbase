import { CacheModes, PWA } from '../PWA';

describe('PWA', () => {
  let classUnderTest: PWA;

  beforeEach(() => {
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
});
