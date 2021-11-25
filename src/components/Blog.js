import React, { useState } from "react"
import PropTypes from "prop-types"

const h3style = {
  padding: "0",
  margin: "0",
}

const pStyle = {
  margin: "0",
  padding: "0",
}

const buttonStyle = {
  border: "none",
  borderRadius: "999px",
  backgroundColor: "rgba(255, 255, 255, .8)",
  cursor: "pointer",
}

const Blog = ({ blog, addLike, toastTime, user, removeBlog, setBlogs }) => {
  const [visible, setVisible] = useState(false)

  const handleAddLike = async (e) => {
    e.preventDefault()

    try {
      await addLike(blog)
      toastTime("success", `${blog.title} <333`)
    } catch (exc) {
      console.error("Error liking: ", exc)
      toastTime("error", "Couldn't like this blog atm =/")
    }
  }

  const handleRemoveBlog = async (e) => {
    e.preventDefault()

    if (window.confirm(`Do you really want to remove ${blog.title} by ${blog.author}?`)) {
      try {
        await removeBlog(blog)
        toastTime("success", `${blog.title} successfully removed! XX`)
        setBlogs((blogs) => blogs.filter((b) => b.id !== blog.id))
      } catch (exc) {
        console.error("Error removing: ", exc)
        toastTime("error", "Couldn't remove blog...")
      }
    }
  }

  return (
    <div
      style={{
        margin: "20px 0",
        padding: "5px",
        border: "1px solid gray",
        backgroundColor: "lightgray",
        borderRadius: ".4em",
      }}
    >
      <h3 style={h3style}>
        {blog.title} by {blog.author}
        <button
          className="show-button"
          style={buttonStyle}
          onClick={() => setVisible(!visible)}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </h3>

      {visible &&
        <>
          <p style={pStyle}>{blog.url}</p>
          <p style={pStyle}>
            <span className="like">{blog.likes}</span>
            <button
              style={buttonStyle}
              onClick={handleAddLike}
            >
              Like
            </button>
          </p>
          {user.id === blog.user.id && <button
            style={{ ...buttonStyle, backgroundColor: "hsla(0, 100%, 95%, 1)", border: "1px solid hsla(0, 80%, 50%, .8)", color: "hsla(0, 80%, 50%, .8)" }}
            onClick={handleRemoveBlog}
          >
            Delete
          </button>}
        </>}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  toastTime: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  removeBlog: PropTypes.func.isRequired,
  setBlogs: PropTypes.func.isRequired
}

export default Blog
