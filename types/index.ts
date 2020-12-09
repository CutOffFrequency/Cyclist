import {LinkedList} from '..'

import {Node} from '../classes/Node'

export interface NodeConstructorArgs<T> {
  data: T
  next?: () => Node<T>
  previous?: () => Node<T>
}

export type ReturnsNode<T> = () => Node<T>

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

export interface ListWithData<T> {
  size: 0
  head: Node<T>
  tail: Node<T>
}
