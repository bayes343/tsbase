const tenSeconds = 10000;

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
