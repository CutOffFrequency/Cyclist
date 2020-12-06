export interface Node<T> {
  data: T
  next: ReturnsNode<T>
  previous: ReturnsNode<T>
}

export interface NodeConstructorArgs<T> {
  data: T
  next?: () => Node<T>
  previous?: () => Node<T>
}

export type ReturnsNode<T> = () => Node<T>

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

export type NodeFunction<T> = (node: Node<T>) => Node<T>
export type NodeIndex = number
export type ListSize = number
export type MaybeNode<T> = Node<T> | undefined

export type IterationCallback<T> = (
  currentNode: Node<T>,
  currentIndex: NodeIndex,
  list: LinkedList<T>
) => void

export type IterationPredicate<T> = (
  currentNode: Node<T>,
  currentIndex: NodeIndex,
  list: LinkedList<T>
) => boolean

export interface EmptyList {
  size: 0
  head: undefined
  tail: undefined
}

export interface LinkedList<T> {
  size: number
  head?: Node<T>
  tail?: Node<T>
}

const isListWithData = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: LinkedList<any> | EmptyList
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): list is LinkedList<any> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (list as LinkedList<any>).size >= 1 && !!list.tail && !!list.head
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
  // if a function is provided as an argument t0 the second parameter: callback, at returns
  // the application of that function to the target node, otherwise at returns the node itself
  // if the targeted index is out of bounds, at returns undefined
  at(
    targetIndex: number,
    callback: NodeFunction<T> = node => node
  ): MaybeNode<T> {
    // the head should be accessible via a negative index with magnitude equal to the list size: this.size * -1
    if (
      !isListWithData(this) ||
      targetIndex >= this.size ||
      Math.abs(targetIndex) > this.size
    )
      return

    if (this.head && (targetIndex === 0 || targetIndex === this.size * -1))
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

    return iterate(targetIndex, (callback = node => node), 0, this.head)
  }

  insert(index: NodeIndex, data: T): ListSize {
    if (index > this.size || index <= (this.size + 1) * -1) {
      return this.size
    }

    const newNode: Node<T> = new Node({data})

    let nextNode = newNode.next()
    if (index === this.size && !!this.head) {
      nextNode = this.head
    } else {
      const nodeAtIndex = this.at(index)
      if (nodeAtIndex) nextNode = nodeAtIndex
    }

    const previousNode = nextNode.previous()

    if (isListWithData(this)) {
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
    if (this.size === 0 || this.head === undefined) return

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

  filter(callback: IterationPredicate<T>): LinkedList<T | unknown> {
    const filteredList = new LinkedList()

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

    if (isListWithData(this) && this.head) iterate(callback, this.head, 0, this)

    return filteredList
  }

  toArray(): Array<T> {
    const arr = [] as Array<T>

    this.forEach(node => arr.push(node.data))

    return arr
  }

  includes(datum: T): boolean {
    let includesDatum = false

    this.forEach(node => {
      if (node.data === datum) includesDatum = true
    })

    return includesDatum
  }

  slice(
    startIndex: NodeIndex,
    endIndex: NodeIndex = this.size - 1
  ): LinkedList<T | unknown> {
    // normalize in case of negative values
    if (startIndex < 0) startIndex = this.size - 1 + startIndex
    if (endIndex < 0) startIndex = this.size - 1 + endIndex

    return this.filter((cur, i) => i >= startIndex && i <= endIndex)
  }
}
