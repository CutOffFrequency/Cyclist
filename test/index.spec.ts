import {LinkedList, Node} from '../index'
import {describe, it} from 'mocha'
import {assert} from 'chai'
import {spy} from 'sinon'

const emptyListFactory = () => new LinkedList()

describe('LinkedList', () => {
  describe('constructor', () => {
    describe('when not passed any nodes', () => {
      const emptyList = emptyListFactory()

      it('creates an empty list with size 0', () => {
        assert.equal(emptyList.size, 0, 'empty list does not have size 0')
      })

      it('creates an empty list with no nodes', () => {
        assert.isUndefined(emptyList.head, 'empty list has a head')
        assert.isUndefined(emptyList.tail, 'empty list has a tail')
      })
    })

    describe('when duplicating an existing list', () => {
      const values = [1, 2, 3, 4]
      const populatedList = emptyListFactory()
      values.forEach(value => populatedList.insertAtTail(value))

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
      values.forEach(value => populatedList.insertAtTail(value))

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

  describe('insertAtHead', () => {
    describe('with no previous nodes', () => {
      const newList = emptyListFactory()
      newList.insertAtHead(1)

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
      newList.insertAtHead(1)
      newList.insertAtHead(2)

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
      newList.insertAtHead(1)
      newList.insertAtHead(2)
      newList.insertAtHead(3)

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

  describe('insertAtTail', () => {
    describe('with no previous nodes', () => {
      const newList = emptyListFactory()
      newList.insertAtTail(1)

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
      newList.insertAtTail(1)
      newList.insertAtTail(2)

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
      newList.insertAtTail(1)
      newList.insertAtTail(2)
      newList.insertAtTail(3)

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

  describe('findNodeAtIndex', () => {
    describe('with a target index that is out of bounds', () => {
      const newList = emptyListFactory()
      newList.insertAtHead(1)

      it('returns undefined', () => {
        assert.isUndefined(newList.findNodeAtIndex(2))
      })
    })

    describe('with no callback argument recieved', () => {
      const newList = emptyListFactory()
      newList.insertAtHead(1)
      newList.insertAtTail(2)
      newList.insertAtTail(3)

      describe('with a target node index of 0', () => {
        it('returns the head', () => {
          assert.equal(newList.findNodeAtIndex(0), newList.head)
        })
      })

      describe('with a positive integer for the target node index', () => {
        it('returns the correct node', () => {
          assert.equal(newList.findNodeAtIndex(1), newList.head.next())
          assert.equal(newList.findNodeAtIndex(2), newList.tail)
        })
      })

      describe('with a negative integer for the target node index', () => {
        it('returns the correct node', () => {
          assert.equal(newList.findNodeAtIndex(-1), newList.tail)
          assert.equal(newList.findNodeAtIndex(-2), newList.tail.previous())
          assert.equal(newList.findNodeAtIndex(-3), newList.head)
        })
      })
    })

    describe('with a callback argument', () => {
      const newList = emptyListFactory()
      newList.insertAtHead(1)
      newList.insertAtTail(2)
      newList.insertAtTail(3)

      const nodeIdentity = (node: Node<number>) => node
      let identitySpy
      // each test in this block should have a fresh spy
      beforeEach(() => {
        identitySpy = spy(nodeIdentity)
      })

      // curry the method under test for readability
      const identifyOfNodeAtIndex = (index: number) =>
        newList.findNodeAtIndex(index, identitySpy)

      describe('with a target node index of 0', () => {
        it('calls the callback with the target node', () => {
          identifyOfNodeAtIndex(0)
          assert(identitySpy.calledOnceWith(newList.head))
        })
      })

      describe('with a positive integer for the target node index', () => {
        it('calls the callback with the correct node', () => {
          identifyOfNodeAtIndex(1)
          assert(identitySpy.calledWith(newList.tail.previous()))

          identifyOfNodeAtIndex(2)
          assert(identitySpy.calledWith(newList.tail))
        })
      })

      describe('with a negative integer for the target node index', () => {
        it('calls the callback with the correct node', () => {
          identifyOfNodeAtIndex(-1)
          assert(identitySpy.calledWith(newList.tail))

          identifyOfNodeAtIndex(-2)
          assert(identitySpy.calledWith(newList.tail.previous()))

          identifyOfNodeAtIndex(-3)
          assert(identitySpy.calledWith(newList.head))
        })
      })
    })
  })

  describe('insertAtIndex', () => {
    describe('handling edge cases', () => {
      const newList = emptyListFactory()
      const insertAtHeadSpy = spy(newList, 'insertAtHead')
      const insertAtTailSpy = spy(newList, 'insertAtTail')

      it('calls insertAtHead with target index === 0', () => {
        newList.insertAtIndex(0, 1)
        assert(insertAtHeadSpy.calledWith(1))
      })

      it('calls insertAtTail with target index === this.size', () => {
        newList.insertAtIndex(newList.size, 2)
        assert(insertAtTailSpy.calledWith(2))
      })

      it('calls insertAtHead with target index === (this.size * -1)', () => {
        newList.insertAtIndex(newList.size * -1, 3)
        assert(insertAtHeadSpy.calledWith(3))
      })

      it('returns the current size with target index out of bounds', () => {
        assert.equal(newList.size, 3)
      })
    })

    describe('with target index of a positive integer < this.size', () => {
      const newList = emptyListFactory()
      newList.insertAtHead(1)
      newList.insertAtTail(3)
      newList.insertAtIndex(1, 2)

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
      newList.insertAtHead(1)
      newList.insertAtTail(3)
      newList.insertAtIndex(-1, 2)

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

  describe('removeAtIndex', () => {
    describe('handling edge cases', () => {
      const newList = emptyListFactory()

      describe('with an empty list', () => {
        it('returns the list size of 0', () => {
          assert.equal(newList.removeAtIndex(0), 0)
        })
      })

      describe('with a single node', () => {
        newList.insertAtHead(1)
        const emptyListSpy = spy(newList, 'emptyList')

        it('calls emptyList', () => {
          assert(emptyListSpy.called)
        })
      })
    })

    describe('targetting the head node', () => {
      const newList = emptyListFactory()
      newList.insertAtHead(1)
      newList.insertAtTail(2)
      newList.insertAtTail(3)
      const head = newList.findNodeAtIndex(0)
      newList.removeAtIndex(0)

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
      newList.insertAtHead(1)
      newList.insertAtTail(2)
      newList.insertAtTail(3)
      const tail = newList.findNodeAtIndex(2)
      newList.removeAtIndex(newList.size - 1)

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
      newList.insertAtHead(1)
      newList.insertAtTail(2)
      newList.insertAtTail(3)
      const middle = newList.findNodeAtIndex(1)
      newList.removeAtIndex(1)

      it('removes the target node', () => {
        assert.equal(newList.findNodeAtIndex(1).data, 3)
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

  describe('iterateOverList', () => {
    const newList = emptyListFactory()
    newList.insertAtHead(1)
    newList.insertAtTail(2)
    newList.insertAtTail(3)
    const results = []
    const pushDataFromNode = node => {
      results.push(node.data)
      return node
    }

    const callbackSpy = spy(pushDataFromNode)
    newList.iterateOverList(callbackSpy)

    it('applies the callback to each node in the list', () => {
      assert(callbackSpy.calledThrice)
      assert.deepEqual(results, [1, 2, 3])
    })
  })

  describe('emptyList', () => {
    const newList = emptyListFactory()
    newList.insertAtHead(1)
    newList.insertAtTail(2)
    newList.insertAtTail(3)
    assert.equal(newList.size, 3)
    newList.emptyList()

    it('removes all nodes', () => {
      assert.isNull(newList.head)
      assert.isNull(newList.tail)
    })

    it('updates the list size', () => {
      assert.equal(newList.size, 0)
    })
  })
})
