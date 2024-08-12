export const toKebabCase = (str: string) => str.replace(/[A-Z0-9]/g, repstr => '-' + repstr.toLowerCase());

// event.targetの型付け用
export interface HTMLEvent<T extends EventTarget> extends Event {
  target: T;
}
