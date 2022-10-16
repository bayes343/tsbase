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

  it('should parse my sitemap', () => {
    // eslint-disable-next-line max-len
    const actual = Xml.ToJson('<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://josephbayes.net/</loc><lastmod>2022-10-02</lastmod><changefreq>weekly</changefreq><priority>1</priority></url><url><loc>https://josephbayes.net/resume</loc><lastmod>2022-10-02</lastmod><changefreq>weekly</changefreq><priority>1</priority></url><url><loc>https://josephbayes.net/projects</loc><lastmod>2022-10-02</lastmod><changefreq>weekly</changefreq><priority>1</priority></url><url><loc>https://josephbayes.net/blog</loc><lastmod>2022-10-02</lastmod><changefreq>weekly</changefreq><priority>1</priority></url><url><loc>https://josephbayes.net/contact</loc><lastmod>2022-10-02</lastmod><changefreq>weekly</changefreq><priority>1</priority></url><url><loc>https://josephbayes.net/blog/the-traveling-salesman-and-human-nature</loc><lastmod>2022-10-02</lastmod><changefreq>weekly</changefreq><priority>1</priority></url><url><loc>https://josephbayes.net/blog/cyclomatic-complexity</loc><lastmod>2022-10-02</lastmod><changefreq>weekly</changefreq><priority>1</priority></url><url><loc>https://josephbayes.net/blog/dependency-injection</loc><lastmod>2022-10-02</lastmod><changefreq>weekly</changefreq><priority>1</priority></url><url><loc>https://josephbayes.net/blog/command-pattern</loc><lastmod>2022-10-02</lastmod><changefreq>weekly</changefreq><priority>1</priority></url><url><loc>https://josephbayes.net/blog/dont-trust-screenshots</loc><lastmod>2022-10-02</lastmod><changefreq>weekly</changefreq><priority>1</priority></url><url><loc>https://josephbayes.net/blog/singleton-pattern</loc><lastmod>2022-10-02</lastmod><changefreq>weekly</changefreq><priority>1</priority></url><url><loc>https://josephbayes.net/blog/github-action-for-npm-packages</loc><lastmod>2022-10-02</lastmod><changefreq>weekly</changefreq><priority>1</priority></url></urlset>');
    expect(JSON.stringify(actual)).toEqual('');
  });
});
