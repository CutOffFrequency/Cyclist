## Doubly Linked List

Doubly Linked List is a lightweight, dependency free linked list implementation in TypeScript.

## About

A list contains nodes that each have a data property, since the LinkedList class takes a generic type, the data property for each node will match a given type.

```
const sweetNode = new Node<number>({data: 1})
```

Each node references a next and previous node via the `next` and `previous` properties (an arrow function that returns the relevant node).

## Setting Up

install with your package manager of choice and import

`import {LinkedList} from 'doublylinkedlist'`

## Usage

new lists can be instantiated with or without existing nodes

```
const niceList = new LinkedList()
```

# Adding nodes

Nodes can be added to lists at the head, tail, or any given index

```
// new Nodes are created automatically and will take the data as an argument
// there is no need to manually create a new node
niceList.insertAtHead(1) // list now has one node with data prop of 1
niceList.insertAtTail(3) // list now has two nodes with data props of 1 and 3
niceList.insertAtIndex(1, 2) // list now has three nodes with data props of 1, 2, and 3
```

# using nodes

Nodes can be accessed individually by Index

```
// probably don't do this if the node's index will change
const niceListHead = niceList.findNodeAtIndex(0)
```

this method can also take a callback for side effects

```
const logNode = node => {
  console.log(node)
  return node
}

niceList.findAtIndex(0, logNode) // data: 1, next: [Node], previous: [Node]
```

a list can also be iterated over to execute side effects

```
niceList.iterateOverList(logNode) // data: 1, next: [Node], previous: [Node]
// data: 2, next: [Node], previous: [Node]
// data: 3, next: [Node], previous: [Node]
```

# removing nodes

Nodes are removed by a given index

```
niceList.removeAtIndex(1) // list now has 2 nodes with data props of 1 and 3
```

or all at once

```
niceList.emptyList() // list is empty
```

Note: When Nodes are removed, they are unlinked from the surrounding nodes automatically
