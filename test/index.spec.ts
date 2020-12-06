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
      const originalList = new LinkedList([1, 2, 3]) as LinkedList<number>
      const duplicateList = new LinkedList(originalList)

      it('creates a new list', () => {
        assert.notDeepEqual(originalList, duplicateList)
      })

      it('creates a new list with the correct properties', () => {
        assert.equal(originalList.size, duplicateList.size)
        assert.equal(originalList.head?.data, duplicateList.head?.data)
        assert.equal(originalList.tail?.data, duplicateList.tail?.data)
      })
    })
  })

  describe('addFirst', () => {
    const newList = emptyListFactory()
    const insertSpy = spy(newList, 'insert')
    newList.addFirst(1)

    it('calls insert with the correct arguments', () => {
      assert(insertSpy.calledWith(0, 1))
    })
  })

  describe('addLast', () => {
    const newList = emptyListFactory()
    const insertSpy = spy(newList, 'insert')
    newList.addLast(1)

    it('calls insert with the correct arguments', () => {
      assert(insertSpy.calledWith(0, 1))
    })
  })

  describe('at', () => {
    describe('with a target index that is out of bounds', () => {
      const newList = new LinkedList([1])

      it('returns undefined', () => {
        assert.isUndefined(newList.at(2))
      })
    })

    describe('with no callback argument recieved', () => {
      const newList = new LinkedList([1, 2, 3])

      describe('with a target node index of 0', () => {
        it('returns the head', () => {
          assert.equal(newList.at(0), newList.head)
        })
      })

      describe('with a positive integer for the target node index', () => {
        it('returns the correct node', () => {
          assert.equal(newList.at(1), newList.head?.next())
          assert.equal(newList.at(2), newList.tail)
        })
      })

      describe('with a negative integer for the target node index', () => {
        it('returns the correct node', () => {
          assert.equal(newList.at(-1), newList.tail)
          assert.equal(newList.at(-2), newList.tail?.previous())
          assert.equal(newList.at(-3), newList.head)
        })
      })
    })

    describe('with a callback argument', () => {
      const newList = new LinkedList([1, 2, 3]) as LinkedList<number>

      const identity = (any: Node<number>): Node<number> => any

      // curry the method under test for readability
      const identifyOfNodeAt = (index: number) => newList.at(index, identity)

      describe('with a target node index of 0', () => {
        it('calls the callback with the target node', () => {
          assert.equal(identifyOfNodeAt(0)?.data, 1)
        })
      })

      describe('with a positive integer for the target node index', () => {
        it('calls the callback with the correct node', () => {
          assert.equal(identifyOfNodeAt(1)?.data, 2)
          assert.equal(identifyOfNodeAt(2)?.data, 3)
        })
      })

      describe('with a negative integer for the target node index', () => {
        it('calls the callback with the correct node', () => {
          assert.equal(identifyOfNodeAt(-1)?.data, 3)
          assert.equal(identifyOfNodeAt(-2)?.data, 2)
          assert.equal(identifyOfNodeAt(-3)?.data, 1)
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
      const newList = new LinkedList([1, 3])
      newList.insert(1, 2)

      it('inserts a new node at the correct index', () => {
        assert.equal(newList.size, 3)
        assert.equal(newList.head?.next().data, 2)
      })

      it('properly links the new node', () => {
        assert.equal(newList.head?.next(), newList.tail?.previous())
        assert.equal(newList.head?.next().next(), newList.tail)
        assert.equal(newList.tail?.previous().previous(), newList.head)
      })
    })

    describe('with a negative integer greater than (this.size * -1)', () => {
      const newList = new LinkedList([1, 3])
      newList.insert(-1, 2)

      it('inserts a new node at the correct index', () => {
        assert.equal(newList.size, 3)
        assert.equal(newList.head?.next().data, 2)
      })

      it('properly links the new node', () => {
        assert.equal(newList.head?.next(), newList.tail?.previous())
        assert.equal(newList.head?.next().next(), newList.tail)
        assert.equal(newList.tail?.previous().previous(), newList.head)
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
      const newList = new LinkedList([1, 2, 3])
      const head = newList.at(0)
      newList.remove(0)

      it('correctly reassigns the head', () => {
        assert.equal(newList.head?.data, 2)
      })

      it('removes the target node', () => {
        assert.equal(newList.tail?.next(), newList.head)
        assert.equal(newList.head?.previous(), newList.tail)
      })

      it('updates the size', () => {
        assert.equal(newList.size, 2)
      })

      it('dereferences the surrounding nodes from the removed node', () => {
        assert.deepEqual(head?.next(), head)
        assert.deepEqual(head?.previous(), head)
      })
    })

    describe('targetting the tail node', () => {
      const newList = new LinkedList([1, 2, 3])
      const tail = newList.at(2)
      newList.remove(newList.size - 1)

      it('correctly reassigns the tail', () => {
        assert.equal(newList.tail?.data, 2)
      })

      it('removes the target node', () => {
        assert.equal(newList.tail?.next(), newList.head)
        assert.equal(newList.head?.previous(), newList.tail)
      })

      it('updates the size', () => {
        assert.equal(newList.size, 2)
      })

      it('dereferences the surrounding nodes from the removed node', () => {
        assert.deepEqual(tail?.next(), tail)
        assert.deepEqual(tail?.previous(), tail)
      })
    })

    describe('targetting a non tail or head node', () => {
      const newList = new LinkedList([1, 2, 3])
      const middle = newList.at(1)
      newList.remove(1)

      it('removes the target node', () => {
        assert.equal(newList.at(1)?.data, 3)
      })

      it('links the surrounding nodes', () => {
        assert.equal(newList.tail?.next(), newList.head)
        assert.equal(newList.head?.previous(), newList.tail)
      })

      it('updates the size', () => {
        assert.equal(newList.size, 2)
      })

      it('dereferences the surrounding nodes from the removed node', () => {
        assert.deepEqual(middle?.next(), middle)
        assert.deepEqual(middle?.previous(), middle)
      })
    })
  })

  describe('forEach', () => {
    const newList = new LinkedList([1, 2, 3])
    const results = [] as number[]
    const pushDataFromNode = (node: Node<number>) => {
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
    const newList = new LinkedList([1, 2, 3])
    assert.equal(newList.size, 3)
    newList.clear()

    it('removes all nodes', () => {
      assert.isUndefined(newList.head)
      assert.isUndefined(newList.tail)
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
    const newList = new LinkedList([1, 2]) as LinkedList<number>
    const filteredList = newList.filter(node => node.data < 2)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unfilteredList = newList.filter(node => true)

    it('returns a new LinkedList', () => {
      assert.isTrue(filteredList instanceof LinkedList)
      assert.notDeepEqual(newList, unfilteredList)
    })

    it('returns a LinkedList with the correct properties', () => {
      assert.equal(filteredList.size, 1)
      assert.equal(filteredList.at(0)?.data, 1)
    })
  })

  describe('includes', () => {
    const refObject = {prop: true}
    const objectsList = new LinkedList([refObject])

    it('identifies if a list includes data that is strictly equal', () => {
      assert.isTrue(objectsList.includes(refObject))
    })

    it('does not identify if a list includes an object that is only loosely equal', () => {
      assert.isFalse(objectsList.includes({prop: true}))
    })
  })

  describe('slice', () => {
    const newList = new LinkedList([1, 2, 3, 4])

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
      assert.equal(subset3.tail?.data, 3)

      assert.equal(subset4.size, 2)
      assert.equal(subset4.tail?.data, 4)
    })

    it('returns an empty list with invalid params', () => {
      assert.equal(emptyList1.size, 0)
      assert.equal(emptyList2.size, 0)
      assert.equal(emptyList3.size, 0)
    })
  })
})
