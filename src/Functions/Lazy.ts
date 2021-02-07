export function Lazy<T>(t: { new(): T; }): () => T {
  let instance: T | null = null;

  return () => {
    return instance || (instance = new t());
  };
};
