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
      this.insertAtHead(head.data)
    }

    let referenceNode = head
    while (referenceNode !== tail) {
      referenceNode = referenceNode.next()
      this.insertAtTail(referenceNode.data)
    }
  }

  insertAtHead(data: T): ListSize {
    const previousHead = this.head
    const newNode: Node<T> = new Node({
      data,
      next: previousHead ? () => previousHead : null,
      previous: this.tail ? () => this.tail : null,
    })

    if (this.head) {
      this.head.previous = () => newNode
    }

    this.head = newNode

    if (!this.tail) {
      this.tail = newNode
      newNode.previous = () => newNode
    }

    this.tail.next = () => this.head

    return (this.size += 1)
  }

  insertAtTail(data: T): ListSize {
    const previousTail = this.tail
    const newNode: Node<T> = new Node({
      data,
      next: this.head ? () => this.head : null,
      previous: previousTail ? () => previousTail : null,
    })

    if (this.tail) {
      this.tail.next = () => newNode
    }

    this.tail = newNode
    if (!this.head) {
      this.head = newNode
      newNode.next = () => this.head
    } else {
      this.head.previous = () => this.tail
    }

    this.head.previous = () => this.tail

    return (this.size += 1)
  }

  // the intention behind this method is to provide baked in iteration in both directions
  // (forward and backward) with a mechanism to execute a user provided side effect
  // (for extensibility) in the form of a callback. When the targeted node is found
  // this method will return the application of the callback to the node, if the user does
  // not supply a callback, this method will instead return the targeted node. This method is
  // unique in that if the targeted index is out of bounds, it will return undefined
  findNodeAtIndex(
    targetIndex: number,
    callback?: NodeFunction<T>,
    previousIndex = 0,
    previousNode: Node<T> = this.head
  ): MaybeNode<T> {
    if (targetIndex === 0) {
      return callback ? callback(this.head) : this.head
    }

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
        return this.findNodeAtIndex(
          targetIndex,
          callback,
          previousIndex + 1,
          previousNode.next()
        )
      case 'decrement':
        return this.findNodeAtIndex(
          targetIndex,
          callback,
          previousIndex - 1,
          previousNode.previous()
        )
      default:
        return callback ? callback(currentNode) : currentNode
    }
  }

  insertAtIndex(index: NodeIndex, data: T): ListSize {
    if (index === 0 || index === this.size * -1) {
      return this.insertAtHead(data)
    }

    if (index === this.size) {
      return this.insertAtTail(data)
    }

    if (index > this.size || index <= (this.size + 1) * -1) {
      return this.size
    }

    const nextNode = this.findNodeAtIndex(index)
    const previousNode = nextNode.previous()

    const newNode = new Node({
      data,
      next: () => nextNode,
      previous: () => previousNode,
    })

    nextNode.previous = () => newNode
    previousNode.next = () => newNode

    return (this.size += 1)
  }

  removeAtIndex(index: NodeIndex): ListSize {
    if (this.size === 0 || index > this.size || index <= (this.size + 1) * -1) {
      return this.size
    }

    if (this.size === 1) {
      return this.emptyList()
    }

    const targetNode = this.findNodeAtIndex(index)

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

  iterateOverList(
    callback: NodeFunction<T>,
    currentNode: Node<T> = this.head,
    currentIndex: NodeIndex = 0,
    finalIndex: NodeIndex = this.size ? this.size - 1 : undefined
  ): void {
    const nextNode = currentNode.next()

    if (!currentNode) return

    if (currentIndex <= finalIndex) {
      callback(currentNode)
    }

    if (!!finalIndex && currentIndex < finalIndex) {
      this.iterateOverList(callback, nextNode, currentIndex + 1, finalIndex)
    }
  }

  emptyList(): ListSize {
    const unlinkNode = node => {
      this.size -= 1
      node.unlink()
    }

    this.iterateOverList(unlinkNode.bind(this))
    this.head = null
    this.tail = null
    return this.size
  }
}
