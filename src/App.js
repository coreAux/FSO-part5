import React, { useState, useEffect, useReducer, useRef } from "react"

import blogService from "./services/blogs"
import loginService from "./services/login"

import Toast from "./components/Toast"
import Togglable from "./components/Togglable"
import Blog from "./components/Blog"
import AddBlogForm from "./components/AddBlogForm"

const toastReducer = (state, action) => {
  switch (action.type) {
  case "error":
    return {
      ...state,
      type: "Error",
      message: action.message
    }
  case "success":
    return {
      ...state,
      type: "Success",
      message: action.message
    }
  case "notification":
    return {
      ...state,
      type: "Notification",
      message: action.message
    }
  case "end":
    return {
      ...state,
      type: "End",
      message: null
    }
  default:
    return {
      ...state,
      type: "End",
      message: null
    }
  }
}

const App = () => {
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [toast, serveToast] = useReducer(toastReducer, {
    type: "End",
    message: null
  })

  const blogFormRef = useRef()

  const toastTime = (type, message) => {
    serveToast({
      type,
      message
    })
  }

  useEffect(() => {
    let timer = setTimeout(() => {
      serveToast({
        type: "end",
        message: null,
      })
    }, 5000)

    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (user) {
      blogService.getAll().then(response => {
        response.sort((a, b) => b.likes - a.likes)
        setBlogs(response)
      }
      )
    }
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        "loggedBlogappUser", JSON.stringify(user)
      )

      blogService.setToken(user.token)

      setUser(user)

      toastTime("success", `${user.username} logged in`)

      setUsername("")
      setPassword("")
    } catch (exc) {
      toastTime("error", "wrong username or password")
      console.error("Error logging in: ", exc)
    }
  }

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              id="username"
              type="text"
              value={username}
              name="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              id="password"
              type="password"
              value={password}
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  return (
    <>
      {toast &&
        <Toast
          {...toast}
        />}
      {user ?
        <div>
          <h2>blogs</h2>
          <p>
            {user.username} logged in
            <button
              onClick={() => {
                window.localStorage.removeItem("loggedBlogappUser")
                setUser(null)
                toastTime("notification", "Logged out")
              }}
            >
              logout
            </button>
          </p>
          <Togglable buttonLabel="Add blog" ref={blogFormRef}>
            <AddBlogForm
              createBlog={blogService.create}
              toastTime={toastTime}
              setBlogs={setBlogs}
              blogFormRef={blogFormRef}
            />
          </Togglable>
          {blogs.map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              addLike={blogService.addLike}
              toastTime={toastTime}
              user={user}
              removeBlog={blogService.remove}
              setBlogs={setBlogs}
            />
          )}
        </div>
        :
        <>
          {loginForm()}
        </>
      }
    </>
  )
}

export default App
