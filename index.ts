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
    this.size += 1
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
    this.size += 1
  }
}
