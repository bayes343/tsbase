/* eslint-disable max-len */
import { Csv } from '../../System/Csv';
import { Strings } from '../Strings';

describe('Csv', () => {
  const json = [{ ID: '16504', WorkItemType: 'Issue', Title: 'Fix issues with code', AssignedTo: Strings.Empty, State: 'To Do', Priority: '1', Tags: 'Bug, Defect' }, { ID: '16505', WorkItemType: 'Issue', Title: 'Merge testing modules', AssignedTo: Strings.Empty, State: 'To Do', Priority: '3', Tags: Strings.Empty }];
  const headers = ['ID', 'Work Item Type', 'Title', 'Assigned To', 'State', 'Priority', 'Tags'];
  const expectedCsv = 'ID,Work Item Type,Title,Assigned To,State,Priority,Tags\r\n\
"16504","Issue","Fix issues with code",,"To Do","1","Bug, Defect"\r\n\
"16505","Issue","Merge testing modules",,"To Do","3",';

  it('EncodeAsCsv should convert json object to csv string', () => {
    expect(Csv.EncodeAsCsv(headers, json)).toEqual(expectedCsv);
  });

  const csv = `Submission ID,Submission Date,Amount,"10"" Dutch Apple Pie - Details","10"" Dutch Apple Pie - Quantity","10"" Dutch Apple Pie - Deductible",OCS Family (Optional),Name - Prefix,Name - First Name,Name - Last Name,Name - Suffix,Email,Phone,Is Recurring,Payment Status,Combined Buyer Name
5d52d4ee-16ac-4a45-9241-acefa27e0f7a,7/18/23 12:48,16,"
1 x $16.00 :
Subtotal : $16.00",1,,Houston,,Chris,Houston,,test@qa.org,444-555-1111,FALSE,paid,#N/A`;
  const keys = ['id', 'date', 'amountDue', null, 'quantity', null, 'family', null, 'customerFirstName', 'customerLastName', null, 'email', 'phone', null, 'paymentStatus', null];
  const expectedJson = [{
    id: '5d52d4ee-16ac-4a45-9241-acefa27e0f7a',
    date: '7/18/23 12:48',
    amountDue: '16',
    quantity: '1',
    family: 'Houston',
    customerFirstName: 'Chris',
    customerLastName: 'Houston',
    email: 'test@qa.org',
    phone: '444-555-1111',
    paymentStatus: 'paid'
  }];

  it('DecodeAsJson should convert csv string to json object', () => {
    expect(Csv.DecodeAsJson(csv, keys)).toEqual(expectedJson);
  });

  it('DecodeAsJson should return an empty array when given an empty csv string', () => {
    expect(Csv.DecodeAsJson('', keys)).toEqual([]);
  });

  it('DecodeAsJson should return an empty array when given an empty array of headers', () => {
    expect(Csv.DecodeAsJson(csv, [])).toEqual([]);
  });
});
