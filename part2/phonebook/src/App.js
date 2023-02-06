import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: "123-456-7890" }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

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

  return (
    <div>
      <h2>Phonebook</h2>
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
        {persons.map(person =>
          <div key={person.name}>{person.name} {person.number}</div>
        )}
      </div>
    </div>
  )

}
export default App