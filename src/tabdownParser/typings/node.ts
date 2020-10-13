import { type } from './type.ts';
export interface Node {
  type: type,
  raw: string,
  line: number,
  tabs: number,
  children: Node[],
  parent?: Node,
}