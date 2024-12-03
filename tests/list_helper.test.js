const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')


test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})


describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  const listWithMultipleBlogs = [
    {
      _id: '1',
      title: 'First Blog',
      author: 'Author One',
      url: 'http://example.com/1',
      likes: 10,
      __v: 0
    },
    {
      _id: '2',
      title: 'Second Blog',
      author: 'Author Two',
      url: 'http://example.com/2',
      likes: 20,
      __v: 0
    }
  ]

  const emptyList = []

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has multiple blogs, sums all likes', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    assert.strictEqual(result, 30)
  })

  test('when list is empty, equals zero', () => {
    const result = listHelper.totalLikes(emptyList)
    assert.strictEqual(result, 0)
  })
})


describe('favorite blog', () => {
  const blogs = [
    {
      title: 'Blog A',
      author: 'Author A',
      likes: 7
    },
    {
      title: 'Blog B',
      author: 'Author B',
      likes: 10
    },
    {
      title: 'Blog C',
      author: 'Author C',
      likes: 5
    }
  ]

  const singleBlog = [
    {
      title: 'Single Blog',
      author: 'Single Author',
      likes: 15
    }
  ]

  const emptyList = []

  test('when list has multiple blogs, returns the one with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, {
      title: 'Blog B',
      author: 'Author B',
      likes: 10
    })
  })

  test('when list has only one blog, returns that blog', () => {
    const result = listHelper.favoriteBlog(singleBlog)
    assert.deepStrictEqual(result, {
      title: 'Single Blog',
      author: 'Single Author',
      likes: 15
    })
  })

  test('when list is empty, returns null', () => {
    const result = listHelper.favoriteBlog(emptyList)
    assert.strictEqual(result, null)
  })
})


describe('most blogs', () => {
    const blogs = [
        { author: 'Author A', title: 'Blog A1', likes: 5 },
        { author: 'Author B', title: 'Blog B1', likes: 3 },
        { author: 'Author A', title: 'Blog A2', likes: 2 },
        { author: 'Author C', title: 'Blog C1', likes: 8 },
        { author: 'Author A', title: 'Blog A3', likes: 1 },
        { author: 'Author B', title: 'Blog B2', likes: 4 }
    ]
    const tiedBlogs = [
        { author: 'Author A', title: 'Blog A1', likes: 5 },
        { author: 'Author B', title: 'Blog B1', likes: 3 },
        { author: 'Author A', title: 'Blog A2', likes: 2 },
        { author: 'Author B', title: 'Blog B2', likes: 4 }
    ]
  
    const emptyList = []
  
    test('when list is empty, returns null', () => {
      const result = listHelper.mostBlogs(emptyList)
      assert.strictEqual(result, null)
    })
  
    test('returns the author with most blogs', () => {
      const result = listHelper.mostBlogs(blogs)
      assert.deepStrictEqual(result, { author: 'Author A', blogs: 3 })
    })
  
    test('handles ties by returning any top author', () => {
      const result = listHelper.mostBlogs(tiedBlogs)
      const validResults = [
        { author: 'Author A', blogs: 2 },
        { author: 'Author B', blogs: 2 }
      ]
      assert.ok(validResults.some(valid => result.author === valid.author && result.blogs === valid.blogs))
    })
})


describe('most likes', () => {
  const blogs = [
    { author: "Author A", likes: 5 },
    { author: "Author B", likes: 12 },
    { author: "Author A", likes: 7 },
    { author: "Author C", likes: 3 },
    { author: "Author B", likes: 4 }
  ]

  const tiedBlogs = [
    { author: "Author A", likes: 5 },
    { author: "Author B", likes: 12 },
    { author: "Author A", likes: 7 },
    { author: "Author C", likes: 3 },
    { author: "Author B", likes: 0 }
  ]

  test('when list is empty, returns null', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test('returns the author with the most likes', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, { author: "Author B", likes: 16 })
  })

  test('handles ties by returning any top blogger', () => {
    const result = listHelper.mostLikes(tiedBlogs)
    const validResults = [
      { author: 'Author A', likes: 12 },
      { author: 'Author B', likes: 12 }
    ]
    assert.ok(validResults.some(valid => result.author === valid.author && result.likes === valid.likes))
  })
})
