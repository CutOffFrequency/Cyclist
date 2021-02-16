import {NodeConstructorArgs, ReturnsNode} from '../../types'

/**
 * class representing a node to be included in linked lists
 * @param {T} data - the data to be included in the node
 * @param {ReturnsNode<T>} next - method that returns the next node
 * @param {ReturnsNode<T>} previous - method that returns the previous node
 */
export class Node<T> {
  data: T
  next: ReturnsNode<T>
  previous: ReturnsNode<T>

  /**
   * create a node
   * @param {T} data - the data to be included in the node
   * @param {ReturnsNode<T>} next - method that returns the next node
   * @param {ReturnsNode<T>} previous - method that returns the previous node
   */
  constructor({data, next, previous}: NodeConstructorArgs<T>) {
    this.data = data
    this.next = next ? next : () => this
    this.previous = previous ? previous : () => this
  }

  /**
   * dereferences surrounding nodes, this is called automatically when a node is removed
   * from lists to prevent circular references, this allows unneeded nodes to be garbage collected
   * @returns undefind
   */
  unlink(): void {
    this.next = () => this
    this.previous = () => this
  }
}
