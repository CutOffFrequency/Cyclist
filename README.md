# Doubly Linked List

## About

Doubly Linked List is a lightweight, dependency free "cyclical" linked list implementation in TypeScript.

Head and tail nodes automatically reference each other. This allows for iteration over a cyclical data structure without having to deal with "index math".

The LinkedList class provides various methods for maintaining the list itself and accessing nodes (see `Usage` below).

## Setting Up

install with your package manager of choice and import

`import {LinkedList} from 'doublylinkedlist'`

## Usage

A list contains nodes that have a data property, The LinkedList class takes a generic type that will match the data property for each node.

Each node references a next and previous node via the `next` and `previous` properties.

```
const sweetNode = new Node<number>({data: 1})
```

New lists can be instantiated with or without existing nodes. These two approaches are extensionally equivalent.

```
const niceList = new LinkedList()
niceList.insertAtHead(sweetNode.data)

const equallyNiceList = new LinkedList({head: sweetNode})
```

### Adding Nodes

Nodes can be added to lists at the head, tail, or any given index. New Nodes are created automatically by the insertion method with no requirement to manually instantiate a new node.

```
niceList.insertAtHead(1)
niceList.size // 1
niceList.insertAtTail(3)
niceList.size // 2
niceList.insertAtIndex(1, 2)
niceList.size // 3
```

### Copying Lists

Lists can be duplicated in their entirety by specifying a head node from a separate list

```
const awesomeList = new LinkedList(head: niceList.head)
awesomeList.size // 3

```

Conversely, a subset of a given list can be duplicated by specifying a different head or tail node from said list

```
const lessNiceList = new LinkedList({head: niceList.head, tail: niceList.tail.previous()})
lessNiceList.size // 2
```

### Using Nodes

Nodes can be accessed individually by Index

```
// don't do this if the node's index will change
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

### Removing Nodes

Specific nodes are removed by a given index

```
niceList.removeAtIndex(1)
niceList.size // 2
```

Additionally, all nodes can be removed at once

```
niceList.emptyList()
niceList.size // 3
```

Note: When Nodes are removed, they are unlinked from the surrounding nodes
