import { Guid } from '../../System/Guid';
import { Strings } from '../../System/Strings';
import { DomEvents, EventTypes } from './EventTypes';

const asap = (func: () => void) => {
  setTimeout(() => {
    try {
      func();
    } catch (error) {
      console.error(error);
    }
  });
};

export type Jsx = {
  attributes?: Record<string, string> | null,
  children?: (Jsx | string)[],
  nodeName: string
};

export const Fragment = 'fragment';

export function ParseJsx(nodeName: any, attributes?: Record<string, string>, ...children: any): Jsx {
  if (typeof nodeName === 'function' && nodeName.constructor) {
    return new nodeName(
      attributes ? attributes : undefined,
      children.length ? children : undefined
    );
  }

  children = [].concat(...children);
  return { nodeName, attributes, children };
}

export class JsxRenderer {
  private constructor() { }

  public static RenderJsx(jsx: Jsx, mainDocument: Document | ShadowRoot = document): string {
    return JsxRenderer.transformJsxToHtml(jsx, mainDocument)
      .outerHTML
      .replace(/<(f|.f)ragment>/g, Strings.Empty);
  }

  private static addElementEventListener(attribute: string, jsx: Jsx, element: HTMLElement, mainDocument: Document | ShadowRoot) {
    const event = attribute.split('on')[1] as EventTypes;
    const func = jsx.attributes?.[attribute] as unknown as (event: Event | null) => any;
    const id = (element.attributes['id' as any] ? element.attributes['id' as any].nodeValue : Guid.NewGuid()) as string;
    element.setAttribute('id', id);

    asap(() => {
      mainDocument.getElementById(id)?.addEventListener(event, func);
    });
  }

  // eslint-disable-next-line complexity
  private static transformJsxToHtml(jsx: Jsx, mainDocument: Document | ShadowRoot): HTMLElement {
    const dom: HTMLElement = document.createElement(jsx.nodeName);

    for (const key in jsx.attributes) {
      if (DomEvents.includes(key)) {
        this.addElementEventListener(key, jsx, dom, mainDocument);
      } else {
        dom.setAttribute(key, jsx.attributes[key]);
      }
    }

    for (const child of jsx.children || []) {
      if (typeof child === 'string' || typeof child === 'number') {
        dom.appendChild(document.createTextNode(child.toString()));
      } else if (child) {
        dom.appendChild(JsxRenderer.transformJsxToHtml(child, mainDocument));
      }
    }

    return dom;
  }
}
