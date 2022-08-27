/* eslint-disable max-len */
import { Mock, Times, Any } from 'tsmockit';
import { IFileSystemAdapter } from '../IFileSystemAdapter';
import { FSPersister } from '../FSPersister';
import { IPathResolver } from '../IPathResolver';

const testFileDir = 'dir/';
const testFilePath = 'testPath';
const testKey = 'bills';
// tslint:disable-next-line: max-line-length
const testFileContents = '{"bills": [{"Name": "fake","Notes": "","Company": "Fake","AmountDue": 10,"AmountPaid": 0,"DueDate": 9,"Month": 0}]}';
const purgedFileContents = '{"bills":[]}';
const accessConstant = 1;

function getMockFileSystemAdapter(): Mock<IFileSystemAdapter> {
  const mockFileSystemAdapter = new Mock<IFileSystemAdapter>();
  mockFileSystemAdapter.Setup(a => a.existsSync(Any<string>()), true);
  mockFileSystemAdapter.Setup(a => a.mkdirSync(Any<string>()), () => null);
  mockFileSystemAdapter.Setup(a => a.accessSync(Any<string>(), Any<number>()), () => null);
  mockFileSystemAdapter.Setup(a => a.writeFileSync(Any<string>(), Any<object>()), () => null);
  mockFileSystemAdapter.Setup(a => a.readFileSync(Any<string>(), Any<string>()), testFileContents);
  mockFileSystemAdapter.Setup(a => a.constants, { W_OK: accessConstant });

  return mockFileSystemAdapter;
}

describe('FSPersister', () => {
  let mockPathResolver: Mock<IPathResolver>;
  let mockFileSystemAdapter: Mock<IFileSystemAdapter>;
  let classUnderTest: FSPersister<any>;

  beforeEach(() => {
    mockPathResolver = new Mock<IPathResolver>();
    mockFileSystemAdapter = getMockFileSystemAdapter();

    mockPathResolver.Setup(r => r.resolve(Any<string>()), testFilePath);

    classUnderTest = new FSPersister(
      testFileDir,
      testFilePath,
      testKey,
      mockPathResolver.Object,
      mockFileSystemAdapter.Object
    );
  });

  it('should construct', () => {
    expect(classUnderTest).toBeDefined();
  });

  it('should retrieve data from a json file', () => {
    const billsData: Array<string> = classUnderTest.Retrieve();
    expect(billsData).toBeDefined();
  });

  it('should persist given items', () => {
    mockFileSystemAdapter = getMockFileSystemAdapter();
    classUnderTest = new FSPersister(testFileDir, testFilePath, testKey, mockPathResolver.Object, mockFileSystemAdapter.Object);

    classUnderTest.Persist(JSON.parse(testFileContents).bills);

    mockFileSystemAdapter.Verify(a => a.writeFileSync(Any<string>(), testFileContents), Times.Once);
  });

  it('should purge the persisted data', () => {
    mockFileSystemAdapter = getMockFileSystemAdapter();
    classUnderTest = new FSPersister(testFileDir, testFilePath, testKey, mockPathResolver.Object, mockFileSystemAdapter.Object);

    classUnderTest.Purge();

    mockFileSystemAdapter.Verify(a => a.writeFileSync(Any<string>(), purgedFileContents), Times.Once);
  });

  it('should create the directory specified if it does not exist', () => {
    mockFileSystemAdapter = getMockFileSystemAdapter();
    mockFileSystemAdapter.Setup(a => a.existsSync(Any<string>()), false);

    classUnderTest = new FSPersister(testFileDir, testFilePath, testKey, mockPathResolver.Object, mockFileSystemAdapter.Object);

    mockFileSystemAdapter.Verify(a => a.existsSync(Any<string>()), Times.Once);
  });

  it('should write a blank json file if one with the specified name does not exist', () => {
    mockFileSystemAdapter = new Mock<IFileSystemAdapter>();
    mockFileSystemAdapter.Setup(a => a.existsSync(Any<string>()), false);
    mockFileSystemAdapter.Setup(a => a.mkdirSync(Any<string>()), () => null);
    mockFileSystemAdapter.Setup(a => a.writeFileSync(Any<string>(), Any<object>()), () => null);

    classUnderTest = new FSPersister(testFileDir, testFilePath, testKey, mockPathResolver.Object, mockFileSystemAdapter.Object);

    mockFileSystemAdapter.Verify(a => a.writeFileSync(Any<string>(), JSON.stringify({})), Times.Once);
  });

  it('should return an empty array when no contents exist to retrieve', () => {
    mockFileSystemAdapter = new Mock<IFileSystemAdapter>();
    mockFileSystemAdapter.Setup(a => a.existsSync(Any<string>()), false);
    mockFileSystemAdapter.Setup(a => a.mkdirSync(Any<string>()), () => null);
    mockFileSystemAdapter.Setup(a => a.writeFileSync(Any<string>(), Any<object>()), () => null);
    mockFileSystemAdapter.Setup(a => a.readFileSync(Any<string>(), Any<object>()), '{}');

    classUnderTest = new FSPersister(testFileDir, testFilePath, testKey, mockPathResolver.Object, mockFileSystemAdapter.Object);
    const billsData = classUnderTest.Retrieve();

    expect(billsData).toBeDefined();
  });

});
