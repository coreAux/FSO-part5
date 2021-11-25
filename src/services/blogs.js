import axios from "axios"
const baseUrl = "/api/blogs"

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.get(baseUrl, config)
  return response.data
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const remove = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${blog.id}`, config)
  return response.data
}

const addLike = async (blogObj) => {
  const config = {
    headers: { Authorization: token },
  }

  console.log(config)

  const newBlog = {
    user: blogObj.user.id,
    likes: blogObj.likes + 1,
    author: blogObj.author,
    title: blogObj.title,
    url: blogObj.url,
  }

  const response = await axios.put(`${baseUrl}/${blogObj.id}`, newBlog, config)
  return response.data
}

const blogService = { getAll, create, remove, setToken, addLike }

export default blogService
