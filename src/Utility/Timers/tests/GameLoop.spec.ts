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

  it('should start and stop the game loop when there are no game events', () => {
    classUnderTest.Start(60);
    expect(classUnderTest['gameLoopTimer'].Enabled).toBeTruthy();
    expect(classUnderTest['framerateTimer'].Enabled).toBeTruthy();

    classUnderTest.Stop();
    expect(classUnderTest['gameLoopTimer'].Enabled).toBeFalsy();
    expect(classUnderTest['framerateTimer'].Enabled).toBeFalsy();
  });

  it('should start and stop the game loop when there are game events', () => {
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
    expect(classUnderTest['gameLoopTimer'].Enabled).toBeTruthy();
    expect(classUnderTest['framerateTimer'].Enabled).toBeTruthy();

    setTimeout(() => {
      expect(framesRendered > 1 && framesRendered < 61).toBeTruthy();
      expect(gameStartedHasPublished).toBeTruthy();

      classUnderTest.Stop();
      expect(classUnderTest['gameLoopTimer'].Enabled).toBeFalsy();
      expect(classUnderTest['framerateTimer'].Enabled).toBeFalsy();
    }, 1000);
  });

  it('karma should cover methods in internal timers when they are called, but since it does not, this test exists', () => {
    classUnderTest.GameEvents.push(new Observable<number>());
    classUnderTest.Framerate.Subscribe(() => null);
    classUnderTest.Start(60);

    classUnderTest['gameLoopTimer'].Elapsed.forEach(f => f());
    classUnderTest['framerateTimer'].Elapsed.forEach(f => f());
  });
});
