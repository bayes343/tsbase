import { Csv } from '../../System/Csv';
import { Strings } from '../Strings';

describe('Csv', () => {
  // eslint-disable-next-line max-len
  const json = [{ ID: '16504', WorkItemType: 'Issue', Title: 'Fix issues with code', AssignedTo: Strings.Empty, State: 'To Do', Priority: '1', Tags: 'Bug, Defect' }, { ID: '16505', WorkItemType: 'Issue', Title: 'Merge testing modules', AssignedTo: Strings.Empty, State: 'To Do', Priority: '3', Tags: Strings.Empty }];
  const headers = ['ID', 'Work Item Type', 'Title', 'Assigned To', 'State', 'Priority', 'Tags'];
  const expectedCsv = 'ID,Work Item Type,Title,Assigned To,State,Priority,Tags\r\n\
"16504","Issue","Fix issues with code",,"To Do","1","Bug, Defect"\r\n\
"16505","Issue","Merge testing modules",,"To Do","3",';

  it('should convert json object to csv string', () => {
    expect(Csv.EncodeAsCsv(headers, json)).toEqual(expectedCsv);
  });
});
