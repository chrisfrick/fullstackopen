const countBy = require('lodash').countBy
const reduce = require('lodash').reduce

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((likesSum, blog) => blog.likes + likesSum, 0)
}

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((favorite, blog) => {
    if (favorite.likes === undefined) return blog
    return blog.likes > favorite.likes ? blog : favorite
  }, {})
  const { _id, url, __v, ...result } = favorite
  return result
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {}
  let blogCounts = countBy(blogs, (blog) => blog.author)
  const mostBlogs = reduce(
    blogCounts,
    (most, currentVal, key) => {
      if (most === { author: 'none', blogs: 0 }) {
        return { author: key, blogs: currentVal }
      } else if (currentVal > most.blogs) {
        return { author: key, blogs: currentVal }
      } else return most
    },
    { author: 'none', blogs: 0 }
  )
  return mostBlogs
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {}
  let likesCount = {}
  for (let blog in blogs) {
    const { author, likes } = blogs[blog]
    if (Object.keys(likesCount).includes(author)) {
      likesCount[author] += likes
    } else {
      likesCount[author] = likes
    }
  }
  const mostLikes = reduce(
    likesCount,
    (most, currentVal, key) => {
      if (most === { author: 'none', likes: 0 }) {
        return { author: key, likes: currentVal }
      } else if (currentVal > most.likes) {
        return { author: key, likes: currentVal }
      } else return most
    },
    { author: 'none', likes: 0 }
  )
  return mostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
