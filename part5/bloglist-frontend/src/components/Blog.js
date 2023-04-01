import { useState } from 'react'

const Blog = ({ blog, handleLike }) => {
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => setExpanded(!expanded)

  const blogStyle = {
    border: '1px solid',
    padding: 5
  }

  if (expanded) return (
    <div style={blogStyle}>
      <div>
      {blog.title} {blog.author} <button onClick={toggleExpanded}>hide</button>
      </div>
      <div>
        {blog.url}
      </div>
      <div>
        likes {blog.likes} <button onClick={handleLike}>like</button>
      </div>
      <div>
        {blog.user.name}
      </div>
      
    </div>  
  )

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleExpanded}>view</button>
    </div>  
  )
}

export default Blog
