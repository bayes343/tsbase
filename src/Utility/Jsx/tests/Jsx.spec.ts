/* eslint-disable max-lines */
import { Any, Mock } from 'tsmockit';
import { Strings } from '../../../System/Strings';
import { Until } from '../../Timers/Until';
import { Jsx, JsxRenderer, ParseJsx } from '../Jsx';

describe('JsxRenderer', () => {
  let mockDocument: Mock<Document>;

  beforeEach(() => {
    mockDocument = new Mock<Document>();
  });

  it('should return the outer html of a parsed jsx node with only inner text', () => {
    const jsxToParse: Jsx = {
      nodeName: 'div',
      children: ['test'],
      attributes: {}
    };
    const expectedOuterHtml = '<div>test</div>';
    expect(JsxRenderer.RenderJsx(jsxToParse)).toEqual(expectedOuterHtml);
  });

  it('should return the outer html of a parsed jsx node with a nested node', () => {
    const jsxToParse: Jsx = {
      nodeName: 'div',
      children: [{
        nodeName: 'p',
        children: ['test']
      }],
      attributes: {}
    };
    const expectedOuterHtml = '<div><p>test</p></div>';
    expect(JsxRenderer.RenderJsx(jsxToParse)).toEqual(expectedOuterHtml);
  });

  it('should return the neutralized outer html of a parsed jsx node with nested string mimicking a component', async () => {
    const jsxToParse: Jsx = {
      nodeName: 'div',
      children: [`<div id="fy-"></div><img src="fake" onerror="alert(1)">
<script>alert("test");</script>
&& <button onfocus='alert(\'haxed\')'>click me!</button>`],
      attributes: {}
    };
    const expectedOuterHtml = `<div>&lt;div id=&quot;fy-&quot;&gt;&lt;/div&gt;&lt;img src=&quot;fake&quot; onerror=&quot;alert(1)&quot;&gt;
&lt;script&gt;alert(&quot;test&quot;);&lt;/script&gt;
&amp;&amp; &lt;button onfocus=&#x27;alert(&#x27;haxed&#x27;)&#x27;&gt;click me!&lt;/button&gt;</div>`;
    expect(JsxRenderer.RenderJsx(jsxToParse)).toContain(expectedOuterHtml);
  });

  it('should set attributes defined in jsx', () => {
    const jsxToParse: Jsx = {
      nodeName: 'div',
      children: [{
        nodeName: 'p',
        children: ['test'],
        attributes: {}
      }],
      attributes: { class: 'test' }
    };
    const expectedOuterHtml = '<div class="test"><p>test</p></div>';
    expect(JsxRenderer.RenderJsx(jsxToParse)).toEqual(expectedOuterHtml);
  });

  it('should return jsx when a child is undefined', () => {
    const undefinedVariable = undefined;
    const jsxToParse: Jsx = {
      nodeName: 'div',
      children: [undefinedVariable as unknown as string],
      attributes: {}
    };
    const expectedOuterHtml = '<div></div>';
    expect(JsxRenderer.RenderJsx(jsxToParse)).toEqual(expectedOuterHtml);
  });

  it('should add event listeners to bound events using existing id attribute', async () => {
    let event: string | undefined;
    let callback: (() => void) | undefined;
    mockDocument.SetupOnce(d => d.querySelector('[id="test-id"]'), {
      addEventListener: (e: string, cb: () => void) => {
        event = e;
        callback = cb;
      }
    });
    let testVariable = 0;
    const jsxToParse: Jsx = {
      nodeName: 'button',
      children: [],
      attributes: {
        'data-id': 'test-data-id',
        id: 'test-id',
        onclick: (() => testVariable = 1) as any
      }
    };

    const renderedHtml = JsxRenderer.RenderJsx(jsxToParse, mockDocument.Object);

    expect(renderedHtml).toEqual('<button data-id="test-data-id" id="test-id"></button>');
    await Until(() => !!event);
    expect(event).toEqual('click');
    callback?.();
    expect(testVariable).toEqual(1);
  });

  it('should not throw an error when attempting to add listener to element that is not in the dom', async () => {
    mockDocument.Setup(d => d.querySelector(Any<string>()), null);
    const jsxToParse: Jsx = {
      nodeName: 'button',
      children: [],
      attributes: {
        id: 'test-id',
        onclick: (() => null) as any
      }
    };
    JsxRenderer.RenderJsx(jsxToParse, mockDocument.Object);
    await Until(() => !!mockDocument.TimesMemberCalled(d => d.querySelector(Any<string>())));
  });

  it('should add guid ids for bound events if none are given', () => {
    const jsxToParse: Jsx = {
      nodeName: 'button',
      attributes: {
        'data-id': 'data-id',
        onclick: (() => true) as any
      },
      children: []
    };

    const renderedHtml = JsxRenderer.RenderJsx(jsxToParse, mockDocument.Object);

    expect(renderedHtml.startsWith('<button data-id="data-id" id=')).toBeTruthy();
    expect(renderedHtml.endsWith('</button>')).toBeTruthy();
    expect(renderedHtml.length).toBeGreaterThan('<button id=></button>'.length + 10);
  });

  it('should parse jsx containing fragments', () => {
    const jsxToParse: Jsx = {
      nodeName: 'fragment',
      attributes: {},
      children: [
        {
          nodeName: 'p',
          attributes: {},
          children: ['test']
        },
        {
          nodeName: 'p',
          attributes: {},
          children: [{
            nodeName: 'span',
            children: ['test'],
            attributes: {}
          }]
        }
      ]
    };
    const expectedOuterHtml = '<p>test</p><p><span>test</span></p>';
    expect(JsxRenderer.RenderJsx(jsxToParse)).toEqual(expectedOuterHtml);
  });

  it('should parse jsx containing fragments returned by a function', () => {
    const jsxToParse: Jsx = ParseJsx(() => ({
      nodeName: 'fragment',
      attributes: {},
      children: [
        {
          nodeName: 'p',
          attributes: {},
          children: ['test']
        },
        {
          nodeName: 'p',
          attributes: {},
          children: [{
            nodeName: 'span',
            children: ['test'],
            attributes: {}
          }]
        }
      ]
    }));
    const expectedOuterHtml = '<p>test</p><p><span>test</span></p>';
    expect(JsxRenderer.RenderJsx(jsxToParse)).toEqual(expectedOuterHtml);
  });

  it('should parse jsx containing fragments returned by a function with "props"', () => {
    const jsxToParse: Jsx = ParseJsx((props: any) => ({
      nodeName: 'fragment',
      attributes: {},
      children: [
        {
          nodeName: 'p',
          attributes: {},
          children: [props.pText]
        },
        {
          nodeName: 'p',
          attributes: {},
          children: [{
            nodeName: 'span',
            children: [props.sText],
            attributes: {}
          }]
        }
      ]
    }), {
      pText: 'p',
      sText: 's'
    });
    const expectedOuterHtml = '<p>p</p><p><span>s</span></p>';
    expect(JsxRenderer.RenderJsx(jsxToParse)).toEqual(expectedOuterHtml);
  });

  it('should parse jsx containing fragments returned by a function with "children"', () => {
    const jsxToParse: Jsx = ParseJsx(
      (_props: any, children: any) => ({
        nodeName: 'div',
        attributes: {},
        children: children
      }),
      undefined,
      {
        nodeName: 'p',
        attributes: {},
        children: ['test']
      },
      {
        nodeName: 'h2',
        attributes: {},
        children: ['test']
      }
    );
    const expectedOuterHtml = '<div><p>test</p><h2>test</h2></div>';
    expect(JsxRenderer.RenderJsx(jsxToParse)).toEqual(expectedOuterHtml);
  });

  it('should parse jsx and render the text false', () => {
    const jsxToParse: Jsx = {
      nodeName: 'fragment',
      attributes: {},
      children: ['false']
    };
    const expectedOuterHtml = 'false';
    expect(JsxRenderer.RenderJsx(jsxToParse)).toEqual(expectedOuterHtml);
  });

  it('should parse jsx and NOT render the boolean value false', () => {
    const jsxToParse: Jsx = {
      nodeName: 'fragment',
      attributes: {},
      children: [false as unknown as string]
    };
    const expectedOuterHtml = Strings.Empty;
    expect(JsxRenderer.RenderJsx(jsxToParse)).toEqual(expectedOuterHtml);
  });

  it('should render an attribute with the string value "false"', async () => {
    const jsxToParse: Jsx = {
      nodeName: 'input',
      attributes: {
        type: 'checkbox',
        'data-attr': 'false'
      },
      children: [false as unknown as string]
    };
    const expectedOuterHtml = '<input type="checkbox" data-attr="false">';
    expect(await JsxRenderer.RenderJsx(jsxToParse)).toEqual(expectedOuterHtml);
  });

  it('should not render an attribute with the boolean value false', async () => {
    const jsxToParse: Jsx = {
      nodeName: 'input',
      attributes: {
        type: 'checkbox',
        checked: false
      }
    };
    const expectedOuterHtml = '<input type="checkbox">';
    expect(await JsxRenderer.RenderJsx(jsxToParse)).toEqual(expectedOuterHtml);
  });
});
