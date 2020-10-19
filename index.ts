export interface Node<T> {
  data: T
  next?: () => Node<T>
  previous?: () => Node<T>
}

export class Node<T> {
  constructor(args: Node<T>) {
    const {data, next, previous} = args
    this.data = data
    this.next = next ? next : null
    this.previous = previous ? previous : null
  }
}

export interface LinkedList<T> {
  head: Node<T>
  tail: Node<T>
  size: number
}

export interface LinkedListConstructorArgs<T> {
  head: Node<T>
  tail?: Node<T>
  size?: number
}

export type NodeFunction<T> = (node: Node<T>) => Node<T>
export type NodeIndex = number
export type ListSize = number
export type MaybeNode<T> = Node<T> | undefined

// Keeping track of both a head and tail for a cyclical doubly linked list may seem redundant
// since the tail is just the current head's previous node however;
// when adding new nodes at the head we don't need to iterate through the entire list
export class LinkedList<T> {
  constructor(args: LinkedListConstructorArgs<T>) {
    const {head, tail, size} = args
    this.head = head ? head : null
    this.tail = tail ? tail : null
    this.size = size ? size : 0
  }

  insertAtHead(data: T): ListSize {
    const previousHead = this.head
    const newNode: Node<T> = new Node({
      data,
      next: () => previousHead,
      previous: () => this.tail,
    })

    if (this.head) {
      this.head.previous = () => newNode
    }

    this.head = newNode
    if (!this.tail) {
      this.tail = newNode
    } else {
      this.tail.next = () => this.head
    }

    return (this.size += 1)
  }

  insertAtTail(data: T): ListSize {
    const previousTail = this.tail
    const newNode: Node<T> = new Node({
      data,
      next: () => this.head,
      previous: () => previousTail,
    })

    if (this.tail) {
      this.tail.next = () => newNode
    }

    this.tail = newNode
    if (!this.head) {
      this.head = newNode
    } else {
      this.head.previous = () => this.tail
    }

    return (this.size += 1)
  }

  // the intention behind this method is to provide baked in iteration in both directions
  // (forward and backward) with a mechanism to execute a user provided side effect
  // (for extensibility) in the form of a callback. When the targeted node is found
  // this method will return the application of the callback to the node, if the user does
  // not supply a callback, this method will instead return the targeted node. This method is
  // unique in that if the targeted index is out of bounds, it will return undefined
  iterateThroughList(
    targetIndex: number,
    callback?: NodeFunction<T>,
    previousIndex = 0,
    previousNode: Node<T> = this.head
  ): MaybeNode<T> {
    // the head should be accessible via a negative index equal to the list size
    if (targetIndex >= this.size || Math.abs(targetIndex) > this.size) return

    if (targetIndex === 0) {
      return callback ? callback(this.head) : this.head
    }

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
        return this.iterateThroughList(
          targetIndex,
          callback,
          previousIndex + 1,
          previousNode.next()
        )
      case 'decrement':
        return this.iterateThroughList(
          targetIndex,
          callback,
          previousIndex - 1,
          previousNode.previous()
        )
      default:
        return callback ? callback(currentNode) : currentNode
    }
  }

  // to do: refactor with newly added iteration method
  insertAtIndex(data: T, index: NodeIndex): ListSize {
    if (index === 0) {
      return this.insertAtHead(data)
    }

    if (index >= this.size) {
      return this.insertAtTail(data)
    }

    let currentNode = this.head
    let previousNode
    let nextNode
    let count = 0
    const insertNewNode = () => {
      const newNode = new Node({
        data,
        next: () => previousNode.next,
        previous: () => previousNode,
      })

      previousNode.next = () => newNode
      newNode.next = () => nextNode
      return (this.size += 1)
    }

    while (count < this.size) {
      if (count === index - 1) {
        previousNode = currentNode
        nextNode = currentNode.next()
      }

      if (count === index) {
        return insertNewNode()
      }

      currentNode = currentNode.next()
      count += 1
    }
  }

  removeAtIndex(index: NodeIndex): ListSize {
    return this.size
  }
}
