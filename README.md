# Doubly Linked List

## About

Doubly Linked List is a lightweight, dependency free "cyclic" linked list implementation in TypeScript.

Head and tail nodes automatically reference each other. This allows for iteration over a cyclic data structure without having to deal with "index math".

The LinkedList class provides various methods for maintaining the list itself and accessing nodes (see `Usage` below).

LinkedLists are iterable and can be instantiated with any iterable.

## Setting Up

install with your package manager of choice and import

`import {LinkedList} from 'doublylinkedlist'`

## Usage

A list contains nodes that have a data property, The LinkedList class takes a generic type that will match the data property for each node.

Each node references a next and previous node via the `next` and `previous` properties.

New lists can be instantiated with or without data. Thee following approaches are extensionally equivalent.

```
// instantiating an empty list first
const niceList = new LinkedList()
niceList.addLast(1)
niceList.addLast(2)

// instantiating a list with data from an iterable
const equallyNiceList = new LinkedList([1, 2])
const anotherEquallyNiceList = new LinkedList(equallyNiceList)
```

### Adding Nodes

Nodes can be added to lists at the head, tail, or any given index. New Nodes are created automatically by the insertion method with no requirement to manually instantiate a new node.

```
niceList.addFirst(1)
niceList.size // 1
niceList.addLast(3)
niceList.size // 2
niceList.insert(1, 2)
niceList.size // 3
```

### Using Nodes

Nodes can be accessed individually by Index

```
// maybe don't do this if the node's index will change
const niceListHead = niceList.at(0)
```

this method can also take a callback for side effects

```
const logNode = node => {
  console.log(node)
  return node
}

niceList.at(0, logNode) // data: 1, next: [Node], previous: [Node]
```

lists can also be iterated over to execute side effects (similar to `Array.forEach`)

```
niceList.forEach(logNode) // data: 1, next: [Node], previous: [Node]
// data: 2, next: [Node], previous: [Node]
// data: 3, next: [Node], previous: [Node]
```

### Removing Nodes

Specific nodes are removed by a given index

```
niceList.remove(1)
niceList.size // 2
```

Additionally, all nodes can be removed at once

```
niceList.clear()
niceList.size // 3
```

Note: When Nodes are removed, they are unlinked from the surrounding nodes
