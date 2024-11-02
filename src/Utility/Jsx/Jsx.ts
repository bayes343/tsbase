import type { EventTypes } from './EventTypes';
import { Guid } from '../../System/Guid';
import { Strings } from '../../System/Strings';

type OptionalDocument = Document | null;
const voidElementTagNames = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

export type Jsx = {
  attributes?: Record<string, string | number | boolean | undefined | ((event: Event | null) => void)> | null,
  children?: (Jsx | string)[],
  nodeName: string
};

export const Fragment = 'fragment';

export function ParseJsx(
  nodeName: string | ((attributes: Jsx['attributes'], children: Jsx['children']) => Jsx),
  attributes?: Jsx['attributes'],
  ...children: (Jsx | string)[]
): Jsx {
  return typeof nodeName === 'function' ?
    nodeName(attributes || {}, children) :
    { nodeName, attributes, children: ([] as (Jsx | string)[]).concat(...children) };
}

export class JsxRenderer {
  private constructor() { }

  public static RenderJsx(jsx: Jsx, documentRef: OptionalDocument = globalThis.document || null): string {
    return JsxRenderer.transformJsxToHtml(jsx, documentRef)
      .replace(/<(f|.f)ragment>/g, Strings.Empty);
  }

  private static addElementEventListener(
    attributeName: string,
    handler: (event: Event | null) => void | undefined,
    element: string,
    documentRef: OptionalDocument
  ): string {
    if (documentRef) {
      const event = attributeName.split('on')[1] as EventTypes;
      let id: string;
      if (element.includes(' id')) {
        id = element.split(' id="')[1].split('"')[0];
      } else {
        id = Guid.NewGuid();
        element += ` id="${id}"`;
      }

      setTimeout(() => {
        try {
          documentRef.querySelector(`[id="${id}"]`)?.addEventListener(event, handler);
        } catch { /* empty */ }
      });
    }

    return element;
  }

  // eslint-disable-next-line complexity
  private static transformJsxToHtml(jsx: Jsx, documentRef: OptionalDocument): string {
    let element = `<${jsx.nodeName}`;

    for (const key in jsx.attributes) {
      const value = jsx.attributes[key];
      if (key.startsWith('on')) {
        element = this.addElementEventListener(key, value as any, element, documentRef);
      } else {
        const shouldAddAttribute = value !== undefined && !(typeof value === 'boolean' && value === false);
        if (shouldAddAttribute) {
          element += ` ${key}="${value.toString()}"`;
        }
      }
    }

    element += '>';

    for (const child of jsx.children || []) {
      if (typeof child === 'string' || typeof child === 'number') {
        element += child.toString()
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;');
      } else if (child) {
        element += JsxRenderer.transformJsxToHtml(child, documentRef);
      }
    }

    return `${element}${!voidElementTagNames.includes(jsx.nodeName) ? `</${jsx.nodeName}>` : Strings.Empty}`;
  }
}
