import {LinkedList, Node} from '../index'
import {describe, it} from 'mocha'
import {assert} from 'chai'
import {spy} from 'sinon'

const emptyListFactory = () => new LinkedList()

describe('LinkedList', () => {
  describe('constructor', () => {
    describe('when not passed any nodes', () => {
      const clear = emptyListFactory()

      it('creates an empty list with size 0', () => {
        assert.equal(clear.size, 0, 'empty list does not have size 0')
      })

      it('creates an empty list with no nodes', () => {
        assert.isUndefined(clear.head, 'empty list has a head')
        assert.isUndefined(clear.tail, 'empty list has a tail')
      })
    })

    describe('when duplicating an existing list', () => {
      const values = [1, 2, 3, 4]
      const populatedList = emptyListFactory()
      values.forEach(value => populatedList.addLast(value))

      const fullsetList = new LinkedList({
        head: populatedList.head,
        tail: populatedList.tail,
      })

      it('creates a new list', () => {
        assert.equal(fullsetList === populatedList, false)
      })

      it('creates a new list with the correct size', () => {
        assert.equal(fullsetList.size, 4)
      })

      it('creates a new list with properly linked nodes', () => {
        assert.equal(fullsetList.tail.next(), fullsetList.head)
        assert.equal(fullsetList.head.previous(), fullsetList.tail)
      })
    })

    describe('when creating a subset of an existing list', () => {
      const values = [1, 2, 3, 4]
      const populatedList = emptyListFactory()
      values.forEach(value => populatedList.addLast(value))

      // when creating a new list from an existing list, passing a non tail node to the constructor
      // should create a list that is a sub set of the existing list
      const subsetList = new LinkedList({
        head: populatedList.head,
        tail: populatedList.tail.previous(),
      })

      it('creates a new list', () => {
        assert.equal(subsetList === populatedList, false)
      })

      it('creates a new list with the correct size', () => {
        assert.equal(subsetList.size, 3)
      })

      it('creates a new list with properly linked nodes', () => {
        assert.equal(subsetList.tail.next(), subsetList.head)
        assert.equal(subsetList.head.previous(), subsetList.tail)
      })

      it('does not mutate the existing list', () => {
        assert.equal(populatedList.tail.data, 4)
        assert.equal(subsetList.tail.data, 3)
      })

      it('does not mutate the Nodes in the existing list', () => {
        assert.equal(populatedList.tail.previous().data, 3)
        assert.equal(subsetList.tail.previous().data, 2)
      })
    })
  })

  describe('addFirst', () => {
    describe('with no previous nodes', () => {
      const newList = emptyListFactory()
      newList.addFirst(1)

      describe('adds an initial node', () => {
        it('increments the size to 1', () => {
          assert.equal(
            newList.size,
            1,
            'new list with one node does not have size 1'
          )
        })

        it('has a head node with the correct data', () => {
          assert.equal(newList.head.data, 1)
        })

        it('has a tail node that is the head node', () => {
          assert.equal(newList.head, newList.tail)
        })

        it('links the head node to itself', () => {
          assert.equal(newList.head.next(), newList.head)
          assert.equal(newList.head.previous(), newList.head)
        })
      })
    })

    describe('with a previous node', () => {
      const newList = emptyListFactory()
      newList.addFirst(1)
      newList.addFirst(2)

      describe('adds a new node at the head of the list', () => {
        it('increments the size to 2', () => {
          assert.equal(
            newList.size,
            2,
            'new list with one node does not have size 2'
          )
        })

        it('replaces the previous head with the new node', () => {
          assert.equal(newList.head.data, 2)
        })

        it('keeps the existing structure intact', () => {
          assert.equal(newList.tail.data, 1)
        })

        it('links the tail to the new head', () => {
          assert.equal(newList.tail.next(), newList.head)
          assert.equal(newList.tail.previous(), newList.head)
          assert.equal(newList.head.next(), newList.tail)
          assert.equal(newList.head.previous(), newList.tail)
        })
      })
    })

    describe('with two previous nodes', () => {
      const newList = emptyListFactory()
      newList.addFirst(1)
      newList.addFirst(2)
      newList.addFirst(3)

      describe('adds a new node at the head of the list', () => {
        it('increments the size to 3', () => {
          assert.equal(
            newList.size,
            3,
            'new list with one node does not have size 3'
          )
        })

        it('replaces the previous head with the new node', () => {
          assert.equal(newList.head.data, 3)
        })

        it('keeps the existing structure intact', () => {
          assert.equal(newList.tail.data, 1)
          assert.equal(newList.tail.previous().data, 2)
        })

        it('links the head to the second node', () => {
          assert.equal(newList.head.next(), newList.tail.previous())
        })

        it('links the tail to the new head', () => {
          assert.equal(newList.tail.next(), newList.head)
          assert.equal(newList.head.previous(), newList.tail)
        })
      })
    })
  })

  describe('addLast', () => {
    describe('with no previous nodes', () => {
      const newList = emptyListFactory()
      newList.addLast(1)

      describe('adds an initial node', () => {
        it('increments the size to 1', () => {
          assert.equal(
            newList.size,
            1,
            'new list with one node does not have size 1'
          )
        })

        it('has a tail node with the correct data', () => {
          assert.equal(newList.tail.data, 1)
        })

        it('has a head node that is the tail node', () => {
          assert.equal(newList.head, newList.tail)
        })

        it('links the tail node to itself', () => {
          assert.equal(newList.tail.previous(), newList.tail)
          assert.equal(newList.tail.next(), newList.tail)
        })
      })
    })

    describe('with a previous node', () => {
      const newList = emptyListFactory()
      newList.addLast(1)
      newList.addLast(2)

      describe('adds a new node at the tail of the list', () => {
        it('increments the size to 2', () => {
          assert.equal(
            newList.size,
            2,
            'new list with one node does not have size 2'
          )
        })

        it('replaces the previous tail with the new node', () => {
          assert.equal(newList.tail.data, 2)
        })

        it('keeps the existing structure intact', () => {
          assert.equal(newList.head.data, 1)
        })

        it('links the head to the new tail', () => {
          assert.equal(newList.tail.next(), newList.head)
          assert.equal(newList.tail.previous(), newList.head)
          assert.equal(newList.head.next(), newList.tail)
          assert.equal(newList.head.previous(), newList.tail)
        })
      })
    })

    describe('with two previous nodes', () => {
      const newList = emptyListFactory()
      newList.addLast(1)
      newList.addLast(2)
      newList.addLast(3)

      describe('adds a new node at the tail end of the list', () => {
        it('increments the size to 3', () => {
          assert.equal(
            newList.size,
            3,
            'new list with one node does not have size 3'
          )
        })

        it('replaces the previous tail with the new node', () => {
          assert.equal(newList.tail.data, 3)
        })

        it('keeps the existing structure intact', () => {
          assert.equal(newList.head.data, 1)
          assert.equal(newList.head.next().data, 2)
        })

        it('links the tail to the second node', () => {
          assert.equal(newList.tail.previous(), newList.head.next())
        })

        it('links the head to the new tail', () => {
          assert.equal(newList.tail.next(), newList.head)
          assert.equal(newList.head.previous(), newList.tail)
        })
      })
    })
  })

  describe('at', () => {
    describe('with a target index that is out of bounds', () => {
      const newList = emptyListFactory()
      newList.addFirst(1)

      it('returns undefined', () => {
        assert.isUndefined(newList.at(2))
      })
    })

    describe('with no callback argument recieved', () => {
      const newList = emptyListFactory()
      newList.addFirst(1)
      newList.addLast(2)
      newList.addLast(3)

      describe('with a target node index of 0', () => {
        it('returns the head', () => {
          assert.equal(newList.at(0), newList.head)
        })
      })

      describe('with a positive integer for the target node index', () => {
        it('returns the correct node', () => {
          assert.equal(newList.at(1), newList.head.next())
          assert.equal(newList.at(2), newList.tail)
        })
      })

      describe('with a negative integer for the target node index', () => {
        it('returns the correct node', () => {
          assert.equal(newList.at(-1), newList.tail)
          assert.equal(newList.at(-2), newList.tail.previous())
          assert.equal(newList.at(-3), newList.head)
        })
      })
    })

    describe('with a callback argument', () => {
      const newList = emptyListFactory()
      newList.addFirst(1)
      newList.addLast(2)
      newList.addLast(3)

      const nodeIdentity = (node: Node<number>) => node

      // curry the method under test for readability
      const identifyOfNodeAtIndex = (index: number) =>
        newList.at(index, nodeIdentity)

      describe('with a target node index of 0', () => {
        it('calls the callback with the target node', () => {
          assert.equal(identifyOfNodeAtIndex(0).data, 1)
        })
      })

      describe('with a positive integer for the target node index', () => {
        it('calls the callback with the correct node', () => {
          assert.equal(identifyOfNodeAtIndex(1).data, 2)
          assert.equal(identifyOfNodeAtIndex(2).data, 3)
        })
      })

      describe('with a negative integer for the target node index', () => {
        it('calls the callback with the correct node', () => {
          assert.equal(identifyOfNodeAtIndex(-1).data, 3)
          assert.equal(identifyOfNodeAtIndex(-2).data, 2)
          assert.equal(identifyOfNodeAtIndex(-3).data, 1)
        })
      })
    })
  })

  describe('insert', () => {
    describe('handling edge cases', () => {
      const newList = emptyListFactory()

      it('returns the current size with target index out of bounds', () => {
        assert.equal(newList.insert(1, 1), 0)
      })
    })

    describe('with target index of a positive integer < this.size', () => {
      const newList = emptyListFactory()
      newList.addFirst(1)
      newList.addLast(3)
      newList.insert(1, 2)

      it('inserts a new node at the correct index', () => {
        assert.equal(newList.size, 3)
        assert.equal(newList.head.next().data, 2)
      })

      it('properly links the new node', () => {
        assert.equal(newList.head.next(), newList.tail.previous())
        assert.equal(newList.head.next().next(), newList.tail)
        assert.equal(newList.tail.previous().previous(), newList.head)
      })
    })

    describe('with a negative integer greater than (this.size * -1)', () => {
      const newList = emptyListFactory()
      newList.addFirst(1)
      newList.addLast(3)
      newList.insert(-1, 2)

      it('inserts a new node at the correct index', () => {
        assert.equal(newList.size, 3)
        assert.equal(newList.head.next().data, 2)
      })

      it('properly links the new node', () => {
        assert.equal(newList.head.next(), newList.tail.previous())
        assert.equal(newList.head.next().next(), newList.tail)
        assert.equal(newList.tail.previous().previous(), newList.head)
      })
    })
  })

  describe('remove', () => {
    describe('handling edge cases', () => {
      const newList = emptyListFactory()

      describe('with an empty list', () => {
        it('returns the list size of 0', () => {
          assert.equal(newList.remove(0), 0)
        })
      })

      describe('with a single node', () => {
        newList.addFirst(1)
        const clearSpy = spy(newList, 'clear')

        it('calls clear', () => {
          assert(clearSpy.called)
        })
      })
    })

    describe('targetting the head node', () => {
      const newList = emptyListFactory()
      newList.addFirst(1)
      newList.addLast(2)
      newList.addLast(3)
      const head = newList.at(0)
      newList.remove(0)

      it('correctly reassigns the head', () => {
        assert.equal(newList.head.data, 2)
      })

      it('removes the target node', () => {
        assert.equal(newList.tail.next(), newList.head)
        assert.equal(newList.head.previous(), newList.tail)
      })

      it('updates the size', () => {
        assert.equal(newList.size, 2)
      })

      it('dereferences the surrounding nodes from the removed node', () => {
        assert.isNull(head.next)
        assert.isNull(head.previous)
      })
    })

    describe('targetting the tail node', () => {
      const newList = emptyListFactory()
      newList.addFirst(1)
      newList.addLast(2)
      newList.addLast(3)
      const tail = newList.at(2)
      newList.remove(newList.size - 1)

      it('correctly reassigns the tail', () => {
        assert.equal(newList.tail.data, 2)
      })

      it('removes the target node', () => {
        assert.equal(newList.tail.next(), newList.head)
        assert.equal(newList.head.previous(), newList.tail)
      })

      it('updates the size', () => {
        assert.equal(newList.size, 2)
      })

      it('dereferences the surrounding nodes from the removed node', () => {
        assert.isNull(tail.next)
        assert.isNull(tail.previous)
      })
    })

    describe('targetting a non tail or head node', () => {
      const newList = emptyListFactory()
      newList.addFirst(1)
      newList.addLast(2)
      newList.addLast(3)
      const middle = newList.at(1)
      newList.remove(1)

      it('removes the target node', () => {
        assert.equal(newList.at(1).data, 3)
      })

      it('links the surrounding nodes', () => {
        assert.equal(newList.tail.next(), newList.head)
        assert.equal(newList.head.previous(), newList.tail)
      })

      it('updates the size', () => {
        assert.equal(newList.size, 2)
      })

      it('dereferences the surrounding nodes from the removed node', () => {
        assert.isNull(middle.next)
        assert.isNull(middle.previous)
      })
    })
  })

  describe('forEach', () => {
    const newList = emptyListFactory()
    newList.addFirst(1)
    newList.addLast(2)
    newList.addLast(3)
    const results = []
    const pushDataFromNode = node => {
      results.push(node.data)
      return node
    }

    const callbackSpy = spy(pushDataFromNode)
    newList.forEach(callbackSpy)

    it('applies the callback to each node in the list', () => {
      assert(callbackSpy.calledThrice)
      assert.deepEqual(results, [1, 2, 3])
    })
  })

  describe('clear', () => {
    const newList = emptyListFactory()
    newList.addFirst(1)
    newList.addLast(2)
    newList.addLast(3)
    assert.equal(newList.size, 3)
    newList.clear()

    it('removes all nodes', () => {
      assert.isNull(newList.head)
      assert.isNull(newList.tail)
    })

    it('updates the list size', () => {
      assert.equal(newList.size, 0)
    })
  })

  describe('toArray', () => {
    const newList = emptyListFactory()
    newList.addFirst(1)
    newList.addLast(2)
    const arrFromList = newList.toArray()

    it('returns an array', () => {
      assert.isArray(arrFromList)
    })

    it('returns an array with the correct properties', () => {
      assert.equal(arrFromList.length, 2)
      assert.equal(arrFromList[0], 1)
      assert.equal(arrFromList[1], 2)
    })
  })

  describe('filter', () => {
    const newList = emptyListFactory()
    newList.addFirst(1)
    newList.addLast(2)
    const filteredList = newList.filter(node => node.data < 2)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unfilteredList = newList.filter(node => true)

    it('returns a new LinkedList', () => {
      assert.isTrue(filteredList instanceof LinkedList)
      assert.notDeepEqual(newList, unfilteredList)
    })

    it('returns a LinkedList with the correct properties', () => {
      assert.equal(filteredList.size, 1)
      assert.equal(filteredList.at(0).data, 1)
    })
  })

  describe('includes', () => {
    const integersList = emptyListFactory()
    integersList.addFirst(1)
    integersList.addLast(2)

    const objectsList = emptyListFactory()
    const refObject = {prop: true}
    objectsList.addFirst(refObject)

    it('identifies if a list includes data that is strictly equal', () => {
      assert.isTrue(integersList.includes(1))
      assert.isTrue(integersList.includes(2))
      assert.isFalse(integersList.includes(3))

      assert.isTrue(objectsList.includes(refObject))
    })

    it('does not identify if a list includes an object that is only loosely equal', () => {
      assert.isFalse(objectsList.includes({prop: true}))
    })
  })

  describe('slice', () => {
    const newList = emptyListFactory()
    newList.addFirst(1)
    newList.addLast(2)
    newList.addLast(3)
    newList.addLast(4)

    const subset1 = newList.slice(0)
    const subset2 = newList.slice(1)
    const subset3 = newList.slice(1, 2)
    const subset4 = newList.slice(-1)

    const emptyList1 = newList.slice(4)
    const emptyList2 = newList.slice(-1, -2)
    const emptyList3 = newList.slice(2, 1)

    it('returns a subset list with the expected properties', () => {
      assert.isTrue(subset1 instanceof LinkedList)
      assert.equal(subset1.size, 4)

      assert.equal(subset2.size, 3)

      assert.equal(subset3.size, 2)
      assert.equal(subset3.tail.data, 3)

      assert.equal(subset4.size, 2)
      assert.equal(subset4.tail.data, 4)
    })

    it('returns an empty list with invalid params', () => {
      assert.equal(emptyList1.size, 0)
      assert.equal(emptyList2.size, 0)
      assert.equal(emptyList3.size, 0)
    })
  })
})
