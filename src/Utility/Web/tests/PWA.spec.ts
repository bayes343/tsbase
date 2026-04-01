import { PWA } from '../PWA';

describe('PWA', () => {
  it('EnableHaptics should throw an error when the window is not defined', () => {
    expect(() => {
      PWA.EnableHaptics(undefined, null as any);
    }).toThrowError('browser context method called in webworker');
  });

  it('EnableHaptics get button and anchors and add click listeners that call vibrate', () => {
    let selectorUsed = '';
    let eventListenerUsed = '';
    let patternUsed = 0;
    let callbackAdded = () => { };

    PWA.EnableHaptics(100, {
      navigator: {
        vibrate: (pattern) => {
          patternUsed = pattern;
        }
      },
      document: {
        querySelectorAll: (selector) => {
          selectorUsed = selector;
          return [{
            addEventListener: (event, cb) => {
              eventListenerUsed = event;
              callbackAdded = cb;
            }
          }];
        }
      }
    } as any);

    expect(selectorUsed).toEqual('a, button');
    expect(eventListenerUsed).toEqual('click');
    callbackAdded();
    expect(patternUsed).toEqual(100);
  });
});
