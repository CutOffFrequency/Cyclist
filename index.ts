export interface Node<T> {
  data: T
  next?: () => Node<T>
  previous?: () => Node<T>
}

export interface NodeConstructorArgs<T> {
  data: T
  next?: () => Node<T>
  previous?: () => Node<T>
}

export class Node<T> {
  constructor({data, next, previous}: NodeConstructorArgs<T>) {
    this.data = data
    this.next = next
    this.previous = previous
  }

  // this method is called on a Node when it is removed from a list in order to remove
  // circular references so that unneeded nodes may be garbage collected
  unlink(): void {
    this.next = null
    this.previous = null
  }
}

export interface LinkedList<T> {
  head: Node<T>
  tail: Node<T>
  size: number
}

export interface LinkedListConstructorInterface<T> {
  head?: Node<T>
  tail?: Node<T>
}

export type LinkedListConstructorArgs<T> =
  | LinkedListConstructorInterface<T>
  | undefined

export type NodeFunction<T> = (node: Node<T>) => Node<T>
export type NodeIndex = number
export type ListSize = number
export type MaybeNode<T> = Node<T> | undefined

export type IterationCallback<T> = (
  currentNode: Node<T>,
  currentIndex?: NodeIndex,
  list?: LinkedList<T>
) => void

export type IterationPredicate<T> = (
  currentNode: Node<T>,
  currentIndex?: NodeIndex,
  list?: LinkedList<T>
) => boolean

const nodeIdentity = node => node

// Keeping track of both a head and tail for a cyclical doubly linked list may seem redundant
// since the tail is just the current head's previous node however it does provide some benefits
export class LinkedList<T> {
  constructor(
    {head, tail}: LinkedListConstructorArgs<T> = {
      // default argument with undefined values allows for destructuring AND instantiation without an options argument
      head: undefined,
      tail: undefined,
    }
  ) {
    this.size = 0

    // instead of initializing the lists's head and tail nodes as the arguments passed to the constructor
    // we want to create new nodes in order to prevent mutations that may cause unwanted side effects
    // the insert methods already handle node instantiation, linking, and increment the list size
    if (head) {
      this.addFirst(head.data)
    }

    let referenceNode = head
    while (referenceNode !== tail) {
      referenceNode = referenceNode.next()
      this.addLast(referenceNode.data)
    }
  }

  addFirst(data: T): ListSize {
    return this.insert(0, data)
  }

  addLast(data: T): ListSize {
    return this.insert(this.size, data)
  }

  // the intention behind this method is to provide baked in iteration in both directions
  // (forward and backward) with a mechanism to execute a user provided side effect
  // (for extensibility) in the form of a callback. When the targeted node is found
  // this method will return the application of the callback to the node, if the user does
  // not supply a callback, this method will instead return the targeted node.
  //  if the targeted index is out of bounds, it will return undefined
  at(
    targetIndex: number,
    callback: NodeFunction<T> = nodeIdentity
  ): MaybeNode<T> {
    if (targetIndex === 0 || targetIndex === this.size * -1)
      return callback(this.head)

    if (targetIndex === this.size - 1 || targetIndex === -1)
      return callback(this.tail)

    const iterate = (
      targetIndex: number,
      callback: NodeFunction<T>,
      previousIndex: NodeIndex,
      previousNode: Node<T>
    ): MaybeNode<T> => {
      // the head should be accessible via a negative index equal to the list size
      if (targetIndex >= this.size || Math.abs(targetIndex) > this.size) return

      let iteration, currentNode

      if (targetIndex > 0 && targetIndex > previousIndex + 1) {
        iteration = 'increment'
      } else if (targetIndex < 0 && targetIndex < previousIndex - 1) {
        iteration = 'decrement'
      } else {
        iteration = 'done'
        currentNode =
          targetIndex > 0 ? previousNode.next() : previousNode.previous()
      }

      switch (iteration) {
        case 'increment':
          return iterate(
            targetIndex,
            callback,
            previousIndex + 1,
            previousNode.next()
          )
        case 'decrement':
          return iterate(
            targetIndex,
            callback,
            previousIndex - 1,
            previousNode.previous()
          )
        default:
          return callback(currentNode)
      }
    }

    return iterate(targetIndex, (callback = node => node), 0, this.head)
  }

  insert(index: NodeIndex, data: T): ListSize {
    if (index > this.size || index <= (this.size + 1) * -1) {
      return this.size
    }

    let newNode, nextNode, previousNode

    if (this.size !== 0) {
      newNode = new Node({
        data,
        next: () => nextNode,
        previous: () => previousNode,
      })

      nextNode = index === this.size ? this.head : this.at(index)
      previousNode = nextNode.previous()
    } else {
      newNode = new Node({
        data,
        next: newNode,
        previous: newNode,
      })

      nextNode = newNode
      previousNode = newNode
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
    if (this.size === 0 || index > this.size || index <= (this.size + 1) * -1) {
      return this.size
    }

    if (this.size === 1) {
      return this.clear()
    }

    const targetNode = this.at(index)

    if (targetNode === this.head) {
      this.head = this.head.next()
    }

    if (targetNode === this.tail) {
      this.tail = this.tail.previous()
    }

    const nextNode = targetNode.next()
    const previousNode = targetNode.previous()
    previousNode.next = () => nextNode
    nextNode.previous = () => previousNode
    targetNode.unlink()
    return (this.size -= 1)
  }

  clear(): ListSize {
    const unlinkNode = node => node.unlink()

    this.forEach(unlinkNode)
    this.head = null
    this.tail = null
    return (this.size = 0)
  }

  forEach(callback: IterationCallback<T>): void {
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

    iterate(callback, this.head, 0, this)

    return filteredList
  }

  toArray(): Array<T> {
    const arr = []

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

    return this.filter((cur, i) => {
      return i >= startIndex && i <= endIndex
    })
  }
}
