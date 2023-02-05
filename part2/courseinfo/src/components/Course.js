const Header = ({ name }) => <h1>{name}</h1>

// const Total = ({ sum }) => <p>Number of exercises {sum}</p>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => {
  return (
    <>
      {parts.map(part => {
        return <Part key={part.id} part={part} />
      }
      )}
    </>
  )
}


const Course = ({ course }) => {
  let totalExercises = course.parts.reduce((total, current) => total + current.exercises, 0)
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <p><strong>total of {totalExercises} exercises</strong></p>
    </div>
    
  )
}

export default Course