import { TestHelpers } from 'tsmockit';
import { Strings } from '../../../Functions/Strings';
import { Jsx, JsxRenderer } from '../Jsx';

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
});
