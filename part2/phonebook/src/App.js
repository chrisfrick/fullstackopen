import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import People from './components/People'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    phonebookService
      .getAll()
      .then(persons => setPersons(persons))
  }, [])

  const handleNameChange = (event) => 
    setNewName(event.target.value)

  const handleNumberChange = (event) =>
    setNewNumber(event.target.value)

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

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
      if (window.confirm(`${newName} is already added to the phonebook. Replace the old number with a new one?`)) {
        // create object for updated person with same info as original
        const updatedPerson = persons.find(p => p.name === personObject.name)
        // update to new number
        console.log("updated object", updatedPerson)
        updatedPerson.number = personObject.number
        // update entry on server
        phonebookService
          .update(updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map (p => p.id =
              personObject.id ? personObject 
              : p))
          })
        return
      }
      else return
    }
    
    phonebookService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const personsToShow = 
    filter === '' ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      phonebookService
        .remove(person.id)
        .then(setPersons(persons.filter(p => p.id !== person.id)))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter handleFilter={handleFilter} />

      <h2>add a new</h2>

      <PersonForm
        handleSubmit={addPerson}
        newName={newName}
        handleName={handleNameChange}
        newNumber={newNumber}
        handleNumber={handleNumberChange}
      />

      <h2>Numbers</h2>

      <People
        persons={personsToShow}
        handleDelete={deletePerson}
      />
      
    </div>
  )

}
export default App
