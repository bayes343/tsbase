import { DoUntil } from '../DoUntil';

describe('DoUntil', () => {
  it('should wait until a condition is met before proceeding', async () => {
    let condition = false;
    setTimeout(() => {
      condition = true;
    }, 100);

    await DoUntil(() => condition, 100, 500);

    expect(condition).toBeTruthy();
  });
});
