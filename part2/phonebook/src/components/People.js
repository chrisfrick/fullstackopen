const Person = ({person, handleDelete}) => (
    <div>
      {person.name} {person.number} <button onClick={() => handleDelete(person)}>delete</button>
    </div>
  )
  
const People = ({persons, handleDelete}) => (
<div>
        {persons.map(person =>
        <Person person={person} key={person.name} handleDelete={handleDelete}/>
        )}
</div>
)

export default People