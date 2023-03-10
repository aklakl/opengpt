export type Prototype = object;

export interface Constructor<T = unknown> {
  prototype: Prototype;
  new (...args: unknown[]): T;
}
