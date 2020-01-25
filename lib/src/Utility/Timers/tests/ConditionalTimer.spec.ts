import { IConditionalTimer } from '../IConditionalTimer';
import { ConditionalTimer } from '../ConditionalTimer';
import { Timer } from '../Timer';

describe('ConditionalTimer', () => {
  let flag = true;
  let iterator = 0;
  const action = () => iterator++;
  const condition = () => flag;
  let classUnderTest: IConditionalTimer;

  beforeEach(() => {
    iterator = 0;
    classUnderTest = new ConditionalTimer(new Timer(10));
  });

  it('should construct', async () => {
    expect(classUnderTest).toBeDefined();
    expect(ConditionalTimer.Instance(300)).toBeDefined();
  });

  it('should do an action when a condition is met', async () => {
    flag = true;
    await classUnderTest.DoWhen(action, condition);
    expect(iterator).toEqual(1);
  });

  it('should do an action until a condition is met', async () => {
    flag = true;
    await classUnderTest.DoUntil(action, condition);
    expect(iterator).toEqual(1);
  });

  it('should do an action while a condition is met', async () => {
    flag = false;
    await classUnderTest.DoWhile(action, condition);
    expect(iterator).toEqual(1);
  });

  it('should stop the underlying timer from executing', () => {
    flag = true;
    classUnderTest.DoWhile(action, condition);

    classUnderTest.Stop();

    expect(iterator).toEqual(0);
  });

});
