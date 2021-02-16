import {
  EmptyList,
  IterationCallback,
  IterationPredicate,
  ListSize,
  ListWithData,
  MaybeNode,
  NodeFunction,
  NodeIndex,
} from '../../types'

import {Node} from '../Node'

/**
 * Class representing a cyclic doubly linked list
 * @param {number} size - the number of nodes in the list
 * @param {Node<T>} head - the first node in the the list
 * @param {Node<T>} tail - the last node in the the list
 */
export class LinkedList<T> implements Iterable<T> {
  size: number
  head?: Node<T>
  tail?: Node<T>

  /**
   * Create a list
   * @param {Iterable} iterable - any iterable collection to be represented by a list
   */
  constructor(iterable?: Iterable<T>) {
    this.size = 0

    if (iterable) {
      for (const item of iterable) {
        this.addLast(item)
      }
    }
  }

  [Symbol.iterator](): IterableIterator<T> {
    const iterableIterator = {
      values: this.toArray(),
      current: 0,
      [Symbol.iterator]: this[Symbol.iterator],
      next: function (): IteratorResult<T> {
        if (this.current < this.values.length) {
          return {value: this.values[this.current++], done: false}
        }
        return {value: undefined, done: true}
      },
    }

    return iterableIterator
  }

  /**
   * typeguard validates list has a positive size value with a head and tail node
   * not intended for use by the end user, the function signature includes a parameter for
   * the list instead of just using `this` so that the type could be expressed as a union
   * @param {LinkedList<T>} list - the LinkedList to be validated
   * @returns {boolean} validation result
   */
  isListWithData(
    list: LinkedList<T> | EmptyList | ListWithData<T>
  ): list is ListWithData<T> {
    return (list as ListWithData<T>).size >= 1 && !!list.tail && !!list.head
  }

  /**
   * adds data in a new head node - curry of LinkedList.insert()
   * @param {T} data - arbitrary data to be included in the new Node
   * @returns {ListSize} the size of the list after insertion
   */
  addFirst(data: T): ListSize {
    return this.insert(0, data)
  }

  /**
   * adds data in a new tail node - curry of LinkedList.insert()
   * @param {T} data - arbitrary data to be included in the new Node
   * @returns {ListSize} the size of the list after insertion
   */
  addLast(data: T): ListSize {
    return this.insert(this.size, data)
  }

  /**
   * iterates through the list to find a node at targetIndex
   * with a positive targeIndex: iterates through the nodes "left to right"
   * with a negative targetIndex: at iterates through the list "right to left"
   * @param {number} targetIndex
   * @param {NodeFunction<T>} callback
   * @returns {MaybeNode} the application of callback to the node at targetIndex, if no callback: the node at targetIndex, if targetIndex is out of bounds: undefined
   */
  at(
    targetIndex: number,
    callback: NodeFunction<T> = (node: Node<T>) => node
  ): MaybeNode<T> {
    // the head should be accessible via a negative index with magnitude equal to the list size: this.size * -1
    if (
      !this.isListWithData(this) ||
      targetIndex >= this.size ||
      Math.abs(targetIndex) > this.size
    )
      return

    if (targetIndex === 0 || targetIndex === this.size * -1)
      return callback(this.head)

    if (targetIndex === this.size - 1 || targetIndex === -1)
      return callback(this.tail)

    const iterate = (
      targetIndex: number,
      callback: NodeFunction<T>,
      previousIndex: NodeIndex,
      previousNode: Node<T> | undefined
    ): MaybeNode<T> => {
      let iteration,
        currentNode = previousNode

      if (targetIndex > 0 && targetIndex > previousIndex + 1) {
        iteration = 'increment'
      } else if (targetIndex < 0 && targetIndex < previousIndex - 1) {
        iteration = 'decrement'
      } else {
        iteration = 'done'
        currentNode =
          targetIndex > 0 ? previousNode?.next() : previousNode?.previous()
      }

      switch (iteration) {
        case 'increment':
          return iterate(
            targetIndex,
            callback,
            previousIndex + 1,
            previousNode?.next()
          )
        case 'decrement':
          return iterate(
            targetIndex,
            callback,
            previousIndex - 1,
            previousNode?.previous()
          )
        default:
          return currentNode ? callback(currentNode) : undefined
      }
    }

    return iterate(targetIndex, callback, 0, this.head)
  }

  /**
   * inserts data in a new Node at index
   * @param {number} index - the index for the new Node
   * @param {T} data - the data to be included in the new Node
   * * @returns {ListSize} the size of the list after insertion, this value will not change if index is out of bounds
   */
  insert(index: NodeIndex, data: T): ListSize {
    if (index > this.size || index < this.size * -1) {
      return this.size
    }

    const newNode: Node<T> = new Node({data})
    let nextNode = newNode.next()

    if (this.isListWithData(this) && index === this.size) {
      nextNode = this.head
    } else {
      const nodeAtIndex = this.at(index)
      if (nodeAtIndex) nextNode = nodeAtIndex
    }

    const previousNode = nextNode.previous()

    if (this.isListWithData(this)) {
      newNode.next = () => nextNode
      newNode.previous = () => previousNode
    }

    nextNode.previous = () => newNode
    previousNode.next = () => newNode

    if (index === 0 || index === this.size * -1) {
      this.head = newNode
    }

    if (index === this.size) {
      this.tail = newNode
    }

    return (this.size += 1)
  }

  /**
   * removes an existing node at index
   * @param {number} index - the index of the node to be removed
   * @returns {ListSize} the size of the list after removing the node
   */
  remove(index: NodeIndex): ListSize {
    if (this.size === 1) {
      return this.clear()
    }

    const nodeAtIndex: MaybeNode<T> = this.at(index)

    if (!nodeAtIndex) return this.size

    if (nodeAtIndex === this.head) {
      this.head = this.head.next()
    }

    if (nodeAtIndex === this.tail) {
      this.tail = this.tail.previous()
    }

    const nextNode = nodeAtIndex.next()
    const previousNode = nodeAtIndex.previous()
    previousNode.next = () => nextNode
    nextNode.previous = () => previousNode
    nodeAtIndex.unlink()
    return (this.size -= 1)
  }

  /**
   * removes all nodes from the list
   * @returns {ListSize} the size of the list after clearing: 0 if succesful
   */
  clear(): ListSize {
    const unlinkNode = (node: Node<T>) => node.unlink()
    this.forEach(unlinkNode)
    this.head = undefined
    this.tail = undefined
    return (this.size = 0)
  }

  /**
   * Array-like method, applies callback to each node
   * @param {IterationCallback} callback - the function to apply to each node
   * @returns undefined
   */
  forEach(callback: IterationCallback<T>): void {
    if (this.isListWithData(this)) {
      const iterate = (
        callback: IterationCallback<T>,
        currentNode: Node<T>,
        currentIndex: NodeIndex,
        list: this = this
      ): void => {
        const nextNode = currentNode?.next()

        if (!currentNode) return

        if (currentIndex <= this.size - 1) {
          callback(currentNode, currentIndex, list)
        }

        if (currentIndex < this.size - 1) {
          iterate(callback, nextNode, currentIndex + 1, list)
        }
      }

      iterate(callback, this.head, 0, this)
    }
  }

  /**
   * Array-like method, applies callback as predicate to filter list
   * @param callback predicate for filtering
   * @returns {LinkedList<T>} new filtered list
   */
  filter(callback: IterationPredicate<T>): LinkedList<T | unknown> {
    const filteredList = new LinkedList()

    if (this.isListWithData(this)) {
      const iterate = (
        callback: IterationPredicate<T>,
        currentNode: Node<T>,
        currentIndex: NodeIndex,
        list: this = this
      ): void => {
        const nextNode = currentNode?.next()

        if (!currentNode) return

        if (currentIndex <= this.size - 1) {
          if (callback(currentNode, currentIndex, list)) {
            filteredList.addLast(currentNode.data)
          }
        }

        if (currentIndex < this.size - 1) {
          iterate(callback, nextNode, currentIndex + 1, list)
        }
      }

      iterate(callback, this.head, 0, this)
    }
    return filteredList
  }

  /**
   * returns list as an array
   * @returns {Array<T>} array containing data from list nodes
   */
  toArray(): Array<T> {
    const arr = [] as Array<T>

    this.forEach((node: Node<T>) => arr.push(node.data))

    return arr
  }

  /**
   * Array-like method, confirms if list includes datum with strict equality
   * @param {T} datum to confirm presence of
   * @returns {boolean} confirmation result
   */
  includes(datum: T): boolean {
    let includesDatum = false

    this.forEach((node: Node<T>) => {
      if (node.data === datum) {
        includesDatum = true
      }
    })

    return includesDatum
  }

  /**
   * Array-like method, returns subset of list
   * @param startIndex index to start slice operation, inclusive
   * @param endIndex index to end slice operation, non-inclusive
   * @returns {LinkedList<T>} a new list
   */
  slice(
    startIndex: NodeIndex,
    endIndex: NodeIndex = this.size
  ): LinkedList<T | unknown> {
    // normalize in case of negative values
    if (startIndex < 0) {
      startIndex = this.size + startIndex
    }
    if (endIndex < 0) {
      endIndex = this.size + endIndex
    }

    return this.filter((cur, i) => i >= startIndex && i < endIndex)
  }
}
