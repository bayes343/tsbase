import type { EventTypes } from './EventTypes';
import { Guid } from '../../System/Guid';
import { Strings } from '../../System/Strings';

type OptionalDocument = Document | null;
const voidElementTagNames = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

export type Jsx = {
  attributes?: Record<string, string | number | boolean> | null,
  children?: (Jsx | string)[],
  nodeName: string
};

export const Fragment = 'fragment';

export function ParseJsx(nodeName: any, attributes?: Record<string, string>, ...children: any): Jsx {
  if (typeof nodeName === 'function') {
    return nodeName(
      attributes ? attributes : {},
      children.length ? children : undefined
    );
  }

  children = [].concat(...children);
  return { nodeName, attributes, children };
}

export class JsxRenderer {
  private constructor() { }

  public static RenderJsx(jsx: Jsx, documentRef: OptionalDocument = globalThis.document || null): string {
    return JsxRenderer.transformJsxToHtml(jsx, documentRef)
      .replace(/<(f|.f)ragment>/g, Strings.Empty);
  }

  private static addElementEventListener(
    attribute: string,
    jsx: Jsx,
    element: string,
    documentRef: OptionalDocument
  ): string {
    if (documentRef) {
      const event = attribute.split('on')[1] as EventTypes;
      const func = jsx.attributes?.[attribute] as unknown as (event: Event | null) => any;
      let id: string;
      if (element.includes(' id')) {
        id = element.split(' id="')[1].split('"')[0];
      } else {
        id = Guid.NewGuid();
        element += ` id="${id}"`;
      }

      setTimeout(() => {
        try {
          documentRef.querySelector(`[id="${id}"]`)?.addEventListener(event, func);
        } catch { /* empty */ }
      });
    }

    return element;
  }

  // eslint-disable-next-line complexity
  private static transformJsxToHtml(jsx: Jsx, documentRef: OptionalDocument): string {
    let element = `<${jsx.nodeName}`;

    for (const key in jsx.attributes) {
      if (key.startsWith('on')) {
        element = this.addElementEventListener(key, jsx, element, documentRef);
      } else {
        const value = jsx.attributes[key];
        const shouldAddAttribute = !(typeof value === 'boolean' && value === false);
        if (shouldAddAttribute) {
          element += ` ${key}="${jsx.attributes[key].toString()}"`;
        }
      }
    }

    element += '>';

    for (const child of jsx.children || []) {
      if (typeof child === 'string' || typeof child === 'number') {
        element += child.toString()
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      } else if (child) {
        element += JsxRenderer.transformJsxToHtml(child, documentRef);
      }
    }

    return `${element}${!voidElementTagNames.includes(jsx.nodeName) ? `</${jsx.nodeName}>` : Strings.Empty}`;
  }
}
