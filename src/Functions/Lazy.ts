/**
 * Returns a function which will create an instance of the given type on the first
 * invocation, and then continue to return that instance on subsequent invocations
 * @param t Type being lazy loaded
 */
export function Lazy<T>(t: { new(): T; }): () => T {
  let instance: T | null = null;

  return () => {
    return instance || (instance = new t());
  };
};
