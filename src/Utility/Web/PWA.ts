import { AsyncCommand, AsyncQuery, Command } from '../../Patterns/CommandQuery/module';
import { LogEntry, Logger, LogLevel } from '../Logger/module';

const enum ServiceWorkerEvents {
  Install = 'install',
  Activate = 'activate',
  Fetch = 'fetch',
}

const enum CacheModes {
  NetworkFirst,
  CacheFirst
}

const enum Errors {
  WorkerContextMethodCalledInBrowser = 'webworker context method called in browser',
  BrowserContextMethodCalledInWorker = 'browser context method called in webworker',
  NotImplemented = 'planned feature not yet implemented',
  FetchFailure = 'Failed to fetch'
}

export class PWA {
  constructor(
    private readonly name: string,
    private readonly version: string
  ) { }

  /**
   * Sets up worker context listeners to support offline capability, defaulting to a network first cache fallback strategy
   * @param workerGlobalScopeRef typically "globalThis.self"
   * @param staticAssets file pathnames to immediately cache for future use
   * @param options other overrides
   */
  public EnableOfflineCompatibility(
    workerGlobalScopeRef: ServiceWorkerGlobalScope,
    staticAssets: string[] = [],
    options: Partial<{
      indexPathname: string;
      cacheMode: CacheModes;
      cacheExclusions: string[];
    }> = {}
  ) {
    if (options.cacheMode === CacheModes.CacheFirst) {
      throw new Error(`options.cacheMode "cacheFirst": ${Errors.NotImplemented}`);
    }
    if (!workerGlobalScopeRef || globalThis.window) {
      throw new Error(Errors.WorkerContextMethodCalledInBrowser);
    }

    const cacheFilesCommand = new AsyncCommand(async () => {
      const cache = await caches.open(this.version + this.name);
      return await cache.addAll(staticAssets);
    });

    const deleteOldCacheCommand = new AsyncCommand(async () => {
      const keys = (await caches.keys())
        .filter((key) => !key.includes(this.version));

      for (const key of keys) {
        await caches.delete(key);
      }
    });

    const networkFirstQuery = (request: Request) =>
      new AsyncQuery<Response>(async () => {
        let response = await fetchAndCache(request);

        if (!response) {
          const cachedResponse = await caches.match(request) || await caches.match(request.url.split('?')[0]);
          response = cachedResponse || (await caches.match(options.indexPathname || '/index.html') as Response);
        }

        return response;
      });

    const fetchAndCache = async (request: Request): Promise<Response | null> => {
      try {
        const response = await fetch(request);

        const copy = response.clone();
        await (await caches.open(this.version + this.name)).put(request, copy);

        return response;
      } catch (error) {
        Logger.Instance.Log(new LogEntry(Errors.FetchFailure, LogLevel.Error, error as Error));
        return null;
      }
    };

    const handleFetchCommand = async (event: FetchEvent): Promise<Response> => {
      const request = event.request;
      const isCacheable = request.method === 'GET' && !(
        options.cacheExclusions || ['sockjs', 'esbuild']).some((s) => request.url.includes(s));

      const response = isCacheable ? (await networkFirstQuery(request).Execute()).Value : await fetch(request);

      return response as Response;
    };

    workerGlobalScopeRef.addEventListener(ServiceWorkerEvents.Install, (event) => {
      event.waitUntil(cacheFilesCommand.Execute());
    });

    workerGlobalScopeRef.addEventListener(ServiceWorkerEvents.Activate, (event) => {
      event.waitUntil(deleteOldCacheCommand.Execute());
    });

    workerGlobalScopeRef.addEventListener(ServiceWorkerEvents.Fetch, (event) => {
      event.respondWith(handleFetchCommand(event));
    });
  }

  /**
   * Add event listeners to apply haptic vibration on buttons and links when "clicked"
   * @param pattern Milliseconds to "vibrate" on tap of buttons and links
   */
  public static EnableHaptics(
    pattern: number | number[] = 100,
    dependencies: {
      windowRef: Window & typeof globalThis
    } = { windowRef: globalThis.window }
  ) {
    if (!dependencies.windowRef) {
      throw new Error(Errors.BrowserContextMethodCalledInWorker);
    }

    new Command(() => {
      Array.from(dependencies.windowRef.document.querySelectorAll('a, button')).forEach(e => {
        e.addEventListener('click', () => navigator.vibrate(pattern));
      });
    }).Execute();
  }
}
