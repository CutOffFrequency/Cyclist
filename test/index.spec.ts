import { LinkedList, Node } from '../index'
import { describe, it } from 'mocha'
import { assert } from 'chai'

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
      const newList: LinkedList<any> = new LinkedList({
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
      })
    })

    describe('with a previous node', () => {
      const newList: LinkedList<any> = new LinkedList({
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
      const newList: LinkedList<any> = new LinkedList({
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
      const newList: LinkedList<any> = new LinkedList({
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
      })
    })

    describe('with a previous node', () => {
      const newList: LinkedList<any> = new LinkedList({
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
      const newList: LinkedList<any> = new LinkedList({
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

})
