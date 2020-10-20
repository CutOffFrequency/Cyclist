import {LinkedList, Node} from '../index'
import {describe, it} from 'mocha'
import {assert} from 'chai'
import {spy} from 'sinon'

describe('LinkedList', () => {
  describe('constructor', () => {
    describe('when not passed any nodes', () => {
      const newList: LinkedList<Node<undefined>> = new LinkedList({
        head: undefined,
      })

      it('creates an empty list with size 0', () => {
        assert.equal(newList.size, 0, 'empty list does not have size 0')
      })

      it('creates an empty list with no nodes', () => {
        assert.isNull(newList.head, 'empty list has a head')
        assert.isNull(newList.tail, 'empty list has a tail')
      })
    })
  })

  describe('insertAtHead', () => {
    describe('with no previous nodes', () => {
      const newList: LinkedList<number> = new LinkedList({
        head: undefined,
      })

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
      const newList: LinkedList<number> = new LinkedList({
        head: undefined,
      })

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
      const newList: LinkedList<number> = new LinkedList({
        head: undefined,
      })

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
      const newList: LinkedList<number> = new LinkedList({
        head: undefined,
      })

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
      const newList: LinkedList<number> = new LinkedList({
        head: undefined,
      })

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
      const newList: LinkedList<number> = new LinkedList({
        head: undefined,
      })

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

  describe('iterateThroughList', () => {
    describe('with a target index that is out of bounds', () => {
      const newList: LinkedList<number> = new LinkedList({
        head: undefined,
      })

      newList.insertAtHead(1)

      it('returns undefined', () => {
        assert.isUndefined(newList.iterateThroughList(2))
      })
    })

    describe('with no callback argument recieved', () => {
      const newList: LinkedList<number> = new LinkedList({
        head: undefined,
      })

      newList.insertAtHead(1)
      newList.insertAtTail(2)
      newList.insertAtTail(3)

      describe('with a target node index of 0', () => {
        it('returns the head', () => {
          assert.equal(newList.iterateThroughList(0), newList.head)
        })
      })

      describe('with a positive integer for the target node index', () => {
        it('returns the correct node', () => {
          assert.equal(newList.iterateThroughList(1), newList.head.next())
          assert.equal(newList.iterateThroughList(2), newList.tail)
        })
      })

      describe('with a negative integer for the target node index', () => {
        it('returns the correct node', () => {
          assert.equal(newList.iterateThroughList(-1), newList.tail)
          assert.equal(newList.iterateThroughList(-2), newList.tail.previous())
          assert.equal(newList.iterateThroughList(-3), newList.head)
        })
      })
    })

    describe('with a callback argument', () => {
      const newList: LinkedList<string | number> = new LinkedList({
        head: undefined,
      })

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
        newList.iterateThroughList(index, identitySpy)

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
    describe('edge cases', () => {
      const newList: LinkedList<number> = new LinkedList({
        head: undefined,
      })

      const insertAtHeadSpy = spy(newList, 'insertAtHead')

      it('calls insertAtHead when inserting at index === 0', () => {
        newList.insertAtIndex(0, 1)
        assert(insertAtHeadSpy.calledWith(1))
      })
    })

    describe('with a positive integer < this.size as the target index', () => {
      const newList: LinkedList<number> = new LinkedList({
        head: undefined,
      })

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
  })
})
