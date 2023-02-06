import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) =>
    setNewNumber(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = { name: newName, number: newNumber}
    // Need to stringify objects because objects won't compare with ===
    /* 
    if (JSON.stringify(persons).includes(JSON.stringify(newName))) {
      return alert(`${newName} is already added to the phonebook`)
    }
    */

    // Let's try a slightly better design (to check if person already exists)
    if (persons.some(person => person.name === personObject.name)) {
      return alert(`${newName} is already added to the phonebook`)
    }
    
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = 
    filter === '' ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <div>filter shown with <input onChange={handleFilter}/></div>
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {personsToShow.map(person =>
          <div key={person.name}>{person.name} {person.number}</div>
        )}
      </div>
    </div>
  )

}
export default App