const Header = ({ name }) => <h2>{name}</h2>

// const Total = ({ sum }) => <p>Number of exercises {sum}</p>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => {
  let totalExercises = parts.reduce((total, current) => total + current.exercises, 0)
  return (
    <>
      {parts.map(part => {
        return <Part key={part.id} part={part} />
      }
      )}
      <p><strong>total of {totalExercises} exercises</strong></p>
    </>
  )
}

const Course = ({ course }) => {
  
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
    </div>
    
  )
}

export default Course