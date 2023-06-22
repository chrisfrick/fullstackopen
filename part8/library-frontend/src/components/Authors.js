import { ALL_AUTHORS, EDIT_BIRTH_YEAR } from '../queries'
import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'

const BirthYearForm = ({ authors }) => {
  const [name, setName] = useState(authors[0].name)
  const [born, setBorn] = useState('')
  const [editBirthYear] = useMutation(EDIT_BIRTH_YEAR)

  const submit = event => {
    event.preventDefault()

    editBirthYear({ variables: { name: name, born: Number(born) } })
    setBorn('')
  }

  return (
    <div>
      <h3>Set birth year</h3>
      <form onSubmit={submit}>
        <div>
          author{' '}
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {authors.map(a => (
              <option value={a.name}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          born{' '}
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

const Authors = props => {
  const result = useQuery(ALL_AUTHORS)

  if (!props.show) {
    return null
  }

  if (result.loading) return <div>loading...</div>

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map(a => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <BirthYearForm authors={authors} />
    </div>
  )
}

export default Authors
