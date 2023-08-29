import { Expect } from 'tsmockit';
import { Observable } from '../../../Patterns/Observable/Observable';
import { GameLoop } from '../GameLoop';

describe('GameLoop', () => {
  let classUnderTest: GameLoop;

  beforeEach(() => {
    classUnderTest = new GameLoop();
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should start and stop the game loop when there are no game events', async () => {
    classUnderTest.Start(60);
    await Expect(
      () => classUnderTest['gameLoopTimer'].Enabled,
      m => m.toBeTruthy());
    await Expect(
      () => classUnderTest['framerateTimer'].Enabled,
      m => m.toBeTruthy());

    classUnderTest.Stop();
    await Expect(
      () => classUnderTest['gameLoopTimer'].Enabled,
      m => m.toBeFalsy());
    await Expect(
      () => classUnderTest['framerateTimer'].Enabled,
      m => m.toBeFalsy());
  });

  it('should start and stop the game loop when there are game events', async () => {
    let framesRendered = 0;
    classUnderTest.Framerate.Subscribe((fr) => {
      framesRendered = fr || 0;
    });
    const GameStarted = new Observable;
    let gameStartedHasPublished = false;
    GameStarted.Subscribe(() => {
      gameStartedHasPublished = true;
    });
    classUnderTest.GameEvents.push(GameStarted);

    classUnderTest.Start(60);
    await Expect(
      () => classUnderTest['gameLoopTimer'].Enabled,
      m => m.toBeTruthy());
    await Expect(
      () => classUnderTest['framerateTimer'].Enabled,
      m => m.toBeTruthy());

    setTimeout(() => {
      expect(framesRendered > 1 && framesRendered < 61).toBeTruthy();
      expect(gameStartedHasPublished).toBeTruthy();

      classUnderTest.Stop();
      expect(classUnderTest['gameLoopTimer'].Enabled).toBeFalsy();
      expect(classUnderTest['framerateTimer'].Enabled).toBeFalsy();
    }, 1000);
  });
});
