import { Csv } from '../Csv';

describe('Csv', () => {
  // eslint-disable-next-line max-len
  const json = [{ ID: '16504', WorkItemType: 'Issue', Title: 'Fix issues with code', AssignedTo: '', State: 'To Do', Priority: '1', Tags: '' }, { ID: '16505', WorkItemType: 'Issue', Title: 'Merge testing modules', AssignedTo: '', State: 'To Do', Priority: '3', Tags: '' }];
  const headers = ['ID', 'Work Item Type', 'Title', 'Assigned To', 'State', 'Priority', 'Tags'];
  const expectedCsv = 'ID,Work Item Type,Title,Assigned To,State,Priority,Tags\r\n\
"16504","Issue","Fix issues with code",,"To Do","1",\r\n\
"16505","Issue","Merge testing modules",,"To Do","3",';

  it('should convert json object to csv string', () => {
    expect(Csv.EncodeAsCsv(headers, json)).toEqual(expectedCsv);
  });
});
