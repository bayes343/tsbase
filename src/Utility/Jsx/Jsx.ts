import type { EventTypes } from './EventTypes';
import { Guid } from '../../System/Guid';
import { Strings } from '../../System/Strings';

type OptionalDocument = Document | null;
const voidElementTagNames = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
type JsxFunc = ((attributes: Jsx['attributes'], children: Jsx['children']) => Jsx);
type ClassComponent = { new(): { render: JsxFunc } };

const isClassComponent = (nodeName: string | JsxFunc | ClassComponent): nodeName is ClassComponent => !!nodeName['prototype'];

export type Jsx = {
  attributes?: Record<string, string | number | boolean | undefined | null | ((event: Event | null) => void)> | null,
  children?: (Jsx | string)[],
  nodeName: string | JsxFunc | ClassComponent
};

export const Fragment = 'fragment';


export function ParseJsx(
  nodeName: string | JsxFunc,
  attributes?: Jsx['attributes'],
  ...children: (Jsx | string)[]
): Jsx {
  return { nodeName, attributes, children: ([] as (Jsx | string)[]).concat(...children) };
}

export class JsxRenderer {
  private constructor() { }

  public static RenderJsx(jsx: Jsx, documentRef: OptionalDocument = globalThis.document || null, globalAttributes = {}): string {
    return JsxRenderer.transformJsxToHtml(jsx, documentRef, globalAttributes)
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
  private static transformJsxToHtml(jsx: Jsx, documentRef: OptionalDocument, globalAttributes = {}): string {
    const attributes = { ...globalAttributes, ...jsx.attributes };
    if (typeof jsx.nodeName === 'function') {
      jsx = isClassComponent(jsx.nodeName) ?
        new jsx.nodeName().render(attributes, jsx.children) :
        jsx.nodeName({ ...globalAttributes, ...jsx.attributes }, jsx.children);
    }
    let element = `<${jsx.nodeName}`;

    for (const key in jsx.attributes) {
      const value = jsx.attributes[key];
      if (key.startsWith('on')) {
        element = this.addElementEventListener(key, value as any, element, documentRef);
      } else {
        const shouldAddAttribute = value !== undefined && value !== null && !(typeof value === 'boolean' && value === false);
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
        element += JsxRenderer.transformJsxToHtml(child, documentRef, globalAttributes);
      }
    }

    return `${element}${typeof jsx.nodeName === 'string' && !voidElementTagNames.includes(jsx.nodeName) ?
      `</${jsx.nodeName}>` : Strings.Empty}`;
  }
}
