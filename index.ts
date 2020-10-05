export interface Node<T> {
  data: T
  next: () => Node<T>
  previous: () => Node<T>
}

export class Node<T> {
  constructor(args: Node<T>) {
    const { data, next, previous } = args
    this.data = data
    this.next = next
    this.previous = previous
  }
}

export interface LinkedList<T> {
  head: Node<T>
  tail: Node<T>
  size: number
}

// Keeping track of both a head and tail for a cyclical doubly linked list may seem redundant
// since the tail is just the current head's previous node however;
// when adding new nodes at the head we don't need to iterate through the entire list
export class LinkedList<T> {
  constructor(args: LinkedList<T>) {
    const { head, tail, size } = args
    this.head = null
    this.tail = null
  }

  insertAtHead(data: T) {
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
    }

    return (this.size += 1)
  }

  insertAtTail(data: T) {
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
    }

    return (this.size += 1)
  }

  insertAtIndex(data: T, index: number) {
    if (index === 0) {
      this.insertAtHead(data)
    }

    if (index >= this.size) {
      this.insertAtTail(data)
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

    while (count < index) {
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

  removeAtIndex(index: number) {
    if (index === 0) {
      const previousHead = this.head
      this.head = previousHead.next()
      this.tail.next = () => this.head
      return (this.size -= 1)
    }

    if (index === this.size - 1) {
      const previousTail = this.tail
      this.tail = previousTail.previous()
      this.tail.next = () => this.head
      return (this.size -= 1)
    }
  }
}
