export function DoUntil(
  condition: () => boolean,
  interval: number,
  limit?: number
): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    let conditionMet = false;
    let elapsedTime = 0;
    const enabled = () => !conditionMet && (!limit || elapsedTime < limit);

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
