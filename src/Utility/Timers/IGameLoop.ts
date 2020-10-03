import { Observable } from '../../Patterns/Observable/Observable';

export interface IGameLoop {
  Framerate: Observable<number>;
  GameEvents: Array<Observable<any>>;
  Start(framerate: number): void;
  Stop(): void;
}
