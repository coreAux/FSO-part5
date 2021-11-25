import React, { useState } from "react"
import { act } from "react-dom/test-utils"

const AddBlogForm = ({ toastTime, setBlogs, blogFormRef, createBlog }) => {
  const [blog, setBlog] = useState({ title: "", author: "", url: "" })

  const handleAddBlog = async (e) => {
    e.preventDefault()

    try {
      const newBlog = await createBlog(blog)

      blogFormRef.current.toggleVisibility()

      console.log(newBlog)

      setBlogs((blogs) => [...blogs, {
        ...newBlog,
        user: {
          id: newBlog.user
        },
      }])

      toastTime("success", "New blog added!")

      act(() => setBlog({ title: "", author: "", url: "" }))
    } catch (exc) {
      toastTime("error", "Couldn't add blog...")
      console.error("Error adding blog: ", exc)
    }
  }

  return (
    <div>
      <h2>Add blog</h2>
      <form onSubmit={handleAddBlog}>
        <div>
          <label>
            title
            <input
              id="title"
              type="text"
              value={blog.title}
              name="title"
              onChange={(e) => setBlog({ ...blog, title: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input
              id="author"
              type="text"
              value={blog.author}
              name="author"
              onChange={(e) => setBlog({ ...blog, author: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            url
            <input
              id="url"
              type="text"
              value={blog.url}
              name="url"
              onChange={(e) => setBlog({ ...blog, url: e.target.value })}
            />
          </label>
        </div>
        <button id="add-new-blog" type="submit">Add blog</button>
      </form>
    </div>
  )
}

export default AddBlogForm
