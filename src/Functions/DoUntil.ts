/**
 * Executes the given function until it returns true
 * @param func
 * @param interval
 * @param limit - an optional maximum elapsed time/cycles constraint
 */
export function DoUntil(
  func: () => boolean,
  interval = 0,
  limit?: number
): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    let conditionMet = false;
    let elapsedTime = 0;
    const enabled = () => !conditionMet && (!limit || elapsedTime < limit);

    const executer = setInterval(async () => {
      elapsedTime += (interval || 1);
      if (enabled()) {
        conditionMet = func();
      } else {
        clearInterval(executer);
        resolve(conditionMet);
      }
    }, interval);
  });
}
