(async () => {
  const tsbase = await import('./src/public_api');
  for (const key of Object.keys(tsbase)) {
    (globalThis as any)[key] = (tsbase as any)[key];
  }
})();
