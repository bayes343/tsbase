import { PWA } from '../PWA';

describe('PWA', () => {
  it('EnableHaptics should throw an error when the window is not defined', () => {
    expect(() => {
      PWA.EnableHaptics(100, {
        windowRef: undefined as any
      });
    }).toThrowError('browser context method called in webworker');
  });
});
