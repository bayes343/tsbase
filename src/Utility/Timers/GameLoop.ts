import { IGameLoop } from './IGameLoop';
import { Timer } from './Timer';
import { Observable } from '../../Patterns/Observable/Observable';

const oneSecond = 1000;

export class GameLoop implements IGameLoop {
  private framesRendered = 0;
  private gameLoopTimer = new Timer();
  private framerateTimer = new Timer(oneSecond);

  public Framerate = new Observable<number>();
  public GameEvents = new Array<Observable<any>>();

  public Start(framerate: number): void {
    this.startGameLoopTimer(framerate);
    this.startFramerateTimer();
  }

  public Stop(): void {
    this.gameLoopTimer.Stop();
    this.framerateTimer.Stop();
  }

  private startGameLoopTimer(framerate: number) {
    const interval = oneSecond / framerate;
    this.gameLoopTimer.Interval = interval;
    this.gameLoopTimer.Elapsed = [
      () => this.GameEvents.forEach(e => e.Publish()),
      () => this.framesRendered++
    ];
    this.gameLoopTimer.Start();
  }

  private startFramerateTimer() {
    this.framerateTimer.Elapsed = [
      () => this.Framerate.Publish(this.framesRendered),
      () => this.framesRendered = 0
    ];
    this.framerateTimer.Start();
  }
}
