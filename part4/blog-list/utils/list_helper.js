const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs
    .reduce((likesSum, blog) => (blog.likes + likesSum), 0)
}

module.exports = {
  dummy,
  totalLikes
}
