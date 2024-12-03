const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const favorite = blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max), blogs[0])

    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
  
    const authorCounts = blogs.reduce((counts, blog) => {
        counts[blog.author] = (counts[blog.author] || 0) + 1
        return counts
    }, {})
  
    const topAuthor = Object.keys(authorCounts).reduce((max, author) =>
        authorCounts[author] > (authorCounts[max] || 0) ? author : max
    )
  
    return {
        author: topAuthor,
        blogs: authorCounts[topAuthor]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null

    const likesByAuthor = blogs.reduce((acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0) + blog.likes
        return acc
    }, {})

    const topAuthor = Object.entries(likesByAuthor).reduce((top, [author, likes]) => {
        return likes > top.likes ? { author, likes } : top
    }, { author: null, likes: 0 })

    return topAuthor
}
  

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}