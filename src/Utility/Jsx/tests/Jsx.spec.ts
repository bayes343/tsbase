/* eslint-disable max-lines */
import { TestHelpers } from 'tsmockit';
import { Strings } from '../../../System/Strings';
import { Jsx, JsxRenderer, ParseJsx } from '../Jsx';

describe('JsxRenderer', () => {
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
        children: ['test'],
        attributes: {}
      }],
      attributes: {}
    };
    const expectedOuterHtml = '<div><p>test</p></div>';
    expect(JsxRenderer.RenderJsx(jsxToParse)).toEqual(expectedOuterHtml);
  });

  it('should return the neutralized outer html of a parsed jsx node with nested string mimicking a component', async () => {
    const jsxToParse: Jsx = {
      nodeName: 'div',
      children: ['<div id="fy-"></div><img src="fake" onerror="alert(1)">'],
      attributes: {}
    };
    const expectedOuterHtml = '<div>&lt;div id="fy-"&gt;&lt;/div&gt;&lt;img src="fake" onerror="alert(1)"&gt;</div>';
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

  it('should add event listeners to bound events', async () => {
    let testVariable = 0;
    const jsxToParse: Jsx = {
      nodeName: 'button',
      children: [],
      attributes: {
        id: 'test-id',
        onclick: (() => testVariable = 1) as any
      }
    };
    const renderedHtml = JsxRenderer.RenderJsx(jsxToParse);
    document.body.innerHTML = renderedHtml;

    const eventProperlyBound = await TestHelpers.TimeLapsedCondition(() => {
      document.getElementById('test-id')?.click();
      return testVariable === 1;
    });

    expect(renderedHtml).toEqual('<button id="test-id"></button>');
    expect(eventProperlyBound).toBeTruthy();
  });

  it('should not attempt to add event listeners if bind element is deleted', async () => {
    document.body.innerHTML = Strings.Empty;
    const jsxToParse: Jsx = {
      nodeName: 'button',
      children: [],
      attributes: {
        id: 'test-id',
        onclick: (() => null) as any
      }
    };

    JsxRenderer.RenderJsx(jsxToParse);

    await TestHelpers.TimeLapsedCondition(() => {
      return expect(document.getElementById('test-id')).toBeNull();
    });
  });

  it('should add guid ids for bound events if none are given', () => {
    const jsxToParse: Jsx = {
      nodeName: 'button',
      attributes: {
        onclick: (() => true) as any
      },
      children: []
    };
    const renderedHtml = JsxRenderer.RenderJsx(jsxToParse);
    expect(renderedHtml.startsWith('<button id=')).toBeTruthy();
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
});
