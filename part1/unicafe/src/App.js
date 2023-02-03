import { useState} from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
)

const Display = ({ name, value }) => (
  <div>{name} {value}</div>
)

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const[neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // event handlers for button clicks
  const handleGood = () => setGood(good + 1)
  const handleNeutral = () => setNeutral(neutral + 1)
  const handleBad = () => setBad(bad + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" handleClick={handleGood}/>
      <Button text="neutral" handleClick={handleNeutral}/>
      <Button text="bad" handleClick={handleBad}/>
      <h1>statistics</h1>
      <Display name="good" value={good}/>
      <Display name="neutral" value={neutral}/>
      <Display name="bad" value={bad}/>
    </div>
  )
}

export default App;
