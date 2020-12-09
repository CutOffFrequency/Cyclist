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

export interface LinkedList<T> {
  size: number
  head?: Node<T>
  tail?: Node<T>
}

export class LinkedList<T> implements Iterable<T> {
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

  isListWithData(
    list: LinkedList<T> | EmptyList | ListWithData<T>
  ): list is ListWithData<T> {
    return (list as ListWithData<T>).size >= 1 && !!list.tail && !!list.head
  }

  addFirst(data: T): ListSize {
    return this.insert(0, data)
  }

  addLast(data: T): ListSize {
    return this.insert(this.size, data)
  }

  // LinkedList.at iterates through the list to find a node specified by index:
  // with a positive targeIndex - at iterates through the nodes "from left to right"
  // as a zero based index: an index of 0 references the head, an index of this.size - 1
  // references the tail
  // with a negative targetIndex - at iterates through the list "from right to left"
  // as a one based index: an index of -1 references the tail, an index of this.size * -1
  // references the head
  // if a function is provided as an argument to the second parameter: callback, at returns
  // the application of that function to the target node, otherwise at returns the node itself
  // if the targeted index is out of bounds, at returns undefined
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

    if (this.tail && (targetIndex === this.size - 1 || targetIndex === -1))
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

  insert(index: NodeIndex, data: T): ListSize {
    if (index > this.size || index <= (this.size + 1) * -1) {
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

  clear(): ListSize {
    const unlinkNode = (node: Node<T>) => node.unlink()
    this.forEach(unlinkNode)
    this.head = undefined
    this.tail = undefined
    return (this.size = 0)
  }

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

  toArray(): Array<T> {
    const arr = [] as Array<T>

    this.forEach((node: Node<T>) => arr.push(node.data))

    return arr
  }

  includes(datum: T): boolean {
    let includesDatum = false

    this.forEach((node: Node<T>) => {
      if (node.data === datum) {
        includesDatum = true
      }
    })

    return includesDatum
  }

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
