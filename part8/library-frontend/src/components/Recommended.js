import { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommended = props => {
  const [favoriteGenre, setFavoriteGenre] = useState(null)
  const [getUser, userResult] = useLazyQuery(ME)

  useEffect(() => {
    getUser()
    if (userResult.data && userResult.data.me) {
      setFavoriteGenre(userResult.data.me.favoriteGenre)
    }
  }, [props.show]) //eslint-disable-line

  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
  })

  if (!props.show) {
    return null
  }

  if (userResult.loading || booksResult.loading) return <div>loading...</div>

  const books = booksResult.data.allBooks

  return (
    <div>
      <h2>recommendations</h2>
      books in your favorite genre <b>{favoriteGenre}</b>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map(b => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended
