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
      'JD',
      0
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
    <item type="xs:integer">0</item>
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

  it('should convert a usps address validation response to json', () => {
    const actual = Xml.ToJson(`<?xml version="1.0" encoding="UTF-8"?>
    <AddressValidateResponse>
      <Address ID="0">
        <Address2>685 FREEDOM VIA</Address2>
        <City>CHRISTIANSBURG</City>
        <CityAbbreviation>CHRISTIANSBRG</CityAbbreviation>
        <State>VA</State>
        <Zip5>24073</Zip5>
        <Zip4>1435</Zip4>
        <DeliveryPoint>85</DeliveryPoint>
        <CarrierRoute>R008</CarrierRoute>
        <DPVConfirmation>Y</DPVConfirmation>
        <DPVCMRA>N</DPVCMRA>
        <DPVFootnotes>AABB</DPVFootnotes>
        <Business>N</Business>
        <CentralDeliveryPoint>N</CentralDeliveryPoint>
        <Vacant>N</Vacant>
      </Address>
    </AddressValidateResponse>`);

    expect(actual).toEqual({
      Address2: '685 FREEDOM VIA',
      City: 'CHRISTIANSBURG',
      CityAbbreviation: 'CHRISTIANSBRG',
      State: 'VA',
      Zip5: '24073',
      Zip4: '1435',
      DeliveryPoint: '85',
      CarrierRoute: 'R008',
      DPVConfirmation: 'Y',
      DPVCMRA: 'N',
      DPVFootnotes: 'AABB',
      Business: 'N',
      CentralDeliveryPoint: 'N',
      Vacant: 'N'
    });
  });

  it('should convert a usps address validation not found error response', () => {
    const actual = Xml.ToJson(`<?xml version="1.0" encoding="UTF-8"?>
    <AddressValidateResponse>
      <Address ID="0">
        <Error>
          <Number>-2147219401</Number>
          <Source>clsAMS</Source>
          <Description>Address Not Found.  </Description>
          <HelpFile/>
          <HelpContext/>
        </Error>
      </Address>
    </AddressValidateResponse>`);

    expect(actual).toEqual({
      Number: '-2147219401',
      Source: 'clsAMS',
      Description: 'Address Not Found.'
    });
  });

  it('should convert a usps address validation invalid request error response', () => {
    const actual = Xml.ToJson(`<?xml version="1.0" encoding="UTF-8"?>
    <Error>
      <Number>80040B19</Number>
      <Description>XML Syntax Error: Please check the XML request to see if it can be parsed.(B)</Description>
      <Source>USPSCOM::DoAuth</Source>
    </Error>`);

    expect(actual).toEqual({
      Number: '80040B19',
      Description: 'XML Syntax Error: Please check the XML request to see if it can be parsed.(B)',
      Source: 'USPSCOM::DoAuth'
    });
  });

});
