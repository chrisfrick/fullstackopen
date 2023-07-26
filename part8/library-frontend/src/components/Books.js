import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = props => {
  const allBooksResult = useQuery(ALL_BOOKS)
  const filteredBooksResult = useQuery(ALL_BOOKS)
  const [filter, setFilter] = useState(null)

  useEffect(() => {
    filteredBooksResult.refetch({ genre: filter })
  }, [filter]) //eslint-disable-line

  if (allBooksResult.loading) return <div>loading...</div>

  if (!props.show) {
    return null
  }

  const allBooks = allBooksResult.data.allBooks
  const allGenres = new Set()
  allBooks.forEach(book =>
    book.genres.forEach(genre => {
      allGenres.add(genre)
    })
  )

  const filteredBooks = filteredBooksResult.data.allBooks
  return (
    <div>
      <h2>books</h2>
      {filter ? (
        <div>
          in genre <b>{filter}</b>
        </div>
      ) : (
        <div>
          in <b>all</b> genres
        </div>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map(b => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {[...allGenres].map(genre => (
        <button key={genre} onClick={() => setFilter(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setFilter(null)}>all genres</button>
    </div>
  )
}

export default Books
