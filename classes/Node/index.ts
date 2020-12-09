import {NodeConstructorArgs, ReturnsNode} from '../../types'

export interface Node<T> {
  data: T
  next: ReturnsNode<T>
  previous: ReturnsNode<T>
}

export class Node<T> {
  constructor({data, next, previous}: NodeConstructorArgs<T>) {
    this.data = data
    this.next = next ? next : () => this
    this.previous = previous ? previous : () => this
  }

  // this method is called on a Node when it is removed from a list in order to remove
  // circular references so that unneeded nodes may be garbage collected
  unlink(): void {
    this.next = () => this
    this.previous = () => this
  }
}
