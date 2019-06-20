import { Mock, Times } from 'tsmockit';
import { IPathResolver } from '../IPathResolver';
import { IFileSystemAdapter } from '../IFileSystemAdapter';
import { FSPersister } from '../FSPersister';
import { Strings } from '../../../Constants/Strings';

const testFileDir = 'dir/';
const testFilePath = 'testPath';
const testKey = 'bills';
// tslint:disable-next-line: max-line-length
const testFileContents = '{"bills": [{"Name": "fake","Notes": "","Company": "Fake","AmountDue": 10,"AmountPaid": 0,"DueDate": 9,"Month": 0}]}';
const purgedFileContents = '{"bills":[]}';
const accessConstant = 1;

describe('FSPersister', () => {
  let mockPathResolver: Mock<IPathResolver>;
  let mockFileSystemAdapter: Mock<IFileSystemAdapter>;
  let classUnderTest: FSPersister;

  beforeEach(() => {
    mockPathResolver = new Mock<IPathResolver>();
    mockFileSystemAdapter = getMockFileSystemAdapter();

    mockPathResolver.Setup(r => r.resolve(Strings.Empty), testFilePath);

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

  it('should retrieve data file a json file', () => {
    const billsData: Array<string> = classUnderTest.Retrieve();
    expect(billsData).toBeDefined();
  });

  it('should persist given items', () => {
    mockFileSystemAdapter = getMockFileSystemAdapter();
    mockFileSystemAdapter.Setup(a => a.writeFileSync(Strings.Empty, testFileContents), () => null);
    classUnderTest = new FSPersister(testFileDir, testFilePath, testKey, mockPathResolver.Object, mockFileSystemAdapter.Object);

    classUnderTest.Persist(JSON.parse(testFileContents).bills);

    mockFileSystemAdapter.Verify(a => a.writeFileSync(Strings.Empty, testFileContents), Times.Once);
  });

  it('should purge the persisted data', () => {
    mockFileSystemAdapter = getMockFileSystemAdapter();
    mockFileSystemAdapter.Setup(a => a.writeFileSync(Strings.Empty, purgedFileContents), () => null);
    classUnderTest = new FSPersister(testFileDir, testFilePath, testKey, mockPathResolver.Object, mockFileSystemAdapter.Object);

    classUnderTest.Purge();

    mockFileSystemAdapter.Verify(a => a.writeFileSync(Strings.Empty, purgedFileContents), Times.Once);
  });

  it('should create the directory specified if it does not exist', () => {
    mockFileSystemAdapter = getMockFileSystemAdapter();
    mockFileSystemAdapter.Setup(a => a.existsSync(Strings.Empty), false);

    classUnderTest = new FSPersister(testFileDir, testFilePath, testKey, mockPathResolver.Object, mockFileSystemAdapter.Object);

    mockFileSystemAdapter.Verify(a => a.existsSync(Strings.Empty), Times.Once);
  });

  it('should write a blank json file if one with the specified name does not exist', () => {
    mockFileSystemAdapter = new Mock<IFileSystemAdapter>();
    mockFileSystemAdapter.Setup(a => a.existsSync(Strings.Empty), false);
    mockFileSystemAdapter.Setup(a => a.mkdirSync(Strings.Empty), () => null);
    mockFileSystemAdapter.Setup(a => a.writeFileSync(Strings.Empty, {}), () => null);

    classUnderTest = new FSPersister(testFileDir, testFilePath, testKey, mockPathResolver.Object, mockFileSystemAdapter.Object);

    mockFileSystemAdapter.Verify(a => a.writeFileSync(Strings.Empty, JSON.stringify({})), Times.Once);
  });

  it('should return an empty array when no contents exist to retrieve', () => {
    mockFileSystemAdapter = new Mock<IFileSystemAdapter>();
    mockFileSystemAdapter.Setup(a => a.existsSync(Strings.Empty), false);
    mockFileSystemAdapter.Setup(a => a.mkdirSync(Strings.Empty), () => null);
    mockFileSystemAdapter.Setup(a => a.writeFileSync(Strings.Empty, {}), () => null);
    mockFileSystemAdapter.Setup(a => a.readFileSync(Strings.Empty, {}), '{}');

    classUnderTest = new FSPersister(testFileDir, testFilePath, testKey, mockPathResolver.Object, mockFileSystemAdapter.Object);
    const billsData = classUnderTest.Retrieve();

    expect(billsData).toBeDefined();
  });

});

// tslint:disable-next-line: only-arrow-functions
function getMockFileSystemAdapter(): Mock<IFileSystemAdapter> {
  const mockFileSystemAdapter = new Mock<IFileSystemAdapter>();
  mockFileSystemAdapter.Setup(a => a.existsSync(Strings.Empty), true);
  mockFileSystemAdapter.Setup(a => a.mkdirSync(Strings.Empty), () => null);
  mockFileSystemAdapter.Setup(a => a.accessSync(Strings.Empty, 0), () => null);
  mockFileSystemAdapter.Setup(a => a.writeFileSync(Strings.Empty, {}), () => null);
  mockFileSystemAdapter.Setup(a => a.readFileSync(Strings.Empty, {}), testFileContents);
  mockFileSystemAdapter.Setup(a => a.constants, { W_OK: accessConstant });

  return mockFileSystemAdapter;
}
