import { Strings } from '../Strings';
import { Xml } from '../Xml';

describe('Xml', () => {
  const expectedJson = {
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

  const getExpectedXml = (rootNodeName = 'root', schema?: string) => Strings.MinifyXml(`<?xml version="1.0" encoding="UTF-8"?>
<${rootNodeName}${schema ? ` xmlns="${schema}"` : ''} type="xs:object">
  <name type="xs:string">John Doe</name>
  <age type="xs:integer">30</age>
  <gender type="xs:string">male</gender>
  <birthDate type="xs:object">
    <day type="xs:integer">1</day>
    <month type="xs:integer">0</month>
    <year type="xs:integer">1990</year>
  </birthDate>
  <nicknames type="xs:array">
    <item type="xs:string">Johnny</item>
    <item type="xs:string">JD</item>
  </nicknames>
  <temp type="xs:decimal">98.1</temp>
  <lactoseIntolerant type="xs:boolean">false</lactoseIntolerant>
</${rootNodeName}>`);

  it('should return an xml representation of a given json object', () => {
    let actual = Xml.FromJson(expectedJson);
    expect(actual).toEqual(getExpectedXml());

    const rootNodeName = 'JohnDoe';
    actual = Xml.FromJson(expectedJson, rootNodeName);
    expect(actual).toEqual(getExpectedXml(rootNodeName));

    const schema = 'https://johndoe.net/schema/john/0.1';
    actual = Xml.FromJson(expectedJson, rootNodeName, schema);
    expect(actual).toEqual(getExpectedXml(rootNodeName, schema));
  });

  it('should return an json object representation of a given xml string', () => {
    const actual = Xml.ToJson(getExpectedXml());
    expect(actual).toEqual(expectedJson);
  });
});
