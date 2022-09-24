import { Xml } from '../Xml';

describe('Xml', () => {
  const json = {
    name: 'John Doe',
    age: 30,
    gender: 'male',
    birthDate: {
      day: 1,
      month: 0,
      year: 1990
    },
    nicknames: [
      'Johnny',
      'JD'
    ],
    temp: 98.1,
    lactoseIntolerant: false
  };

  const getExpectedXml = (rootNodeName = 'root', schema?: string) => `<?xml version="1.0" encoding="UTF-8"?>
<${rootNodeName}${schema ? ` xmlns="${schema}"` : ''}>
  <name type="xs:string">John Doe</name>
  <age type="xs:integer">30</age>
  <gender type="xs:string">male</gender>
  <birthDate>
    <day type="xs:integer">1</day>
    <month type="xs:integer">0</month>
    <year type="xs:integer">1990</year>
  </birthDate>
  <nicknames>
    <item type="xs:string">Johnny</item>
    <item type="xs:string">JD</item>
  </nicknames>
  <temp type="xs:decimal">98.1</temp>
  <lactoseIntolerance type="xs:boolean">false</temp>
</${rootNodeName}>`;

  it('should return an xml representation of a given json object', () => {
    let actual = Xml.FromJson(json);
    expect(actual).toEqual(getExpectedXml());

    const rootNodeName = 'JohnDoe';
    actual = Xml.FromJson(json, rootNodeName);
    expect(actual).toEqual(getExpectedXml(rootNodeName));

    const schema = 'https://johndoe.net/schema/john/0.1';
    actual = Xml.FromJson(json, rootNodeName, schema);
    expect(actual).toEqual(getExpectedXml(rootNodeName, schema));
  });

  // it('should return an json object representation of a given xml string', () => {

  // });
});
