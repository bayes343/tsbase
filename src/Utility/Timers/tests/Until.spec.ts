import { Until } from '../Until';

describe('Until', () => {
  it('should wait until a condition is met before proceeding', async () => {
    let condition = false;
    setTimeout(() => {
      condition = true;
    }, 100);

    await Until(() => condition, 100, 500);

    expect(condition).toBeTruthy();
  });
});
