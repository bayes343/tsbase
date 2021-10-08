const tenSeconds = 10000;

/**
 * Wait until the condition is met or the given limit is reached (whichever is first).
 * @param condition
 * @param interval
 * @param limit
 */
export function Until(
  condition: () => boolean,
  interval = 0,
  limit = tenSeconds
): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    let conditionMet = false;
    let elapsedTime = 0;
    const enabled = () => !conditionMet && elapsedTime < limit;

    const executer = setInterval(async () => {
      elapsedTime += (interval || 1);
      if (enabled()) {
        conditionMet = condition();
      } else {
        clearInterval(executer);
        resolve(conditionMet);
      }
    }, interval);
  });
}
