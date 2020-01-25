// import { Mock, Times } from 'tsmockit';
// import { ITimer } from '../ITimer';
import { IConditionalTimer } from '../IConditionalTimer';
import { ConditionalTimer } from '../ConditionalTimer';
import { Timer } from '../Timer';

describe('ConditionalTimer', () => {
  // const mockTimer = new Mock<ITimer>();
  let classUnderTest: IConditionalTimer;

  beforeEach(() => {
    // mockTimer.Setup(t => t.Elapsed, new Array<Function>());
    // mockTimer.Setup(t => t.Start());

    classUnderTest = new ConditionalTimer(new Timer(10));
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should do an action when a condition is met', async () => {
    const flag = true;
    let iterator = 0;
    const action = () => iterator++;
    const condition = () => flag;

    await classUnderTest.DoWhen(action, condition);

    expect(iterator).toEqual(1);
  });

  it('should do an action until a condition is met', async () => {
    const flag = true;
    let iterator = 0;
    const action = () => iterator++;
    const condition = () => flag;

    await classUnderTest.DoUntil(action, condition);

    expect(iterator).toEqual(1);
  });

  it('should do an action while a condition is met', async () => {
    const flag = false;
    let iterator = 0;
    const action = () => iterator++;
    const condition = () => flag;

    await classUnderTest.DoWhile(action, condition);

    expect(iterator).toEqual(1);
  });

});
