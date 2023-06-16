import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => axios.get(baseUrl).then((response) => response.data)

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (newObject) => {
  const response = await axios.put(`${baseUrl}/${newObject.id}`, newObject)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

const addComment = async ({ comment, id }) => {
  const commentObject = { comment: comment }
  const response = await axios.post(`${baseUrl}/${id}/comments`, commentObject)
  return response.data
}

const blogService = { setToken, getAll, create, update, remove, addComment }
export default blogService
