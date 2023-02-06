const Person = ({person}) => (
    <div>{person.name} {person.number}</div>
  )
  
const People = ({persons}) => (
<div>
        {persons.map(person =>
        <Person person={person} key={person.name}/>
        )}
</div>
)

export default People