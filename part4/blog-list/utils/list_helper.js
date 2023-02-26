const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs
    .reduce((likesSum, blog) => (blog.likes + likesSum), 0)
}

const favoriteBlog = (blogs) => {
  const favorite = blogs
    .reduce((favorite, blog) => {
      if (favorite.likes === undefined) return blog
      return blog.likes > favorite.likes
        ? blog
        : favorite
    }, {})
  const {_id, url, __v, ...result } = favorite
  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
