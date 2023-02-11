import axios from 'axios'
import { useState, useEffect } from 'react'

const CountryList = ({ countries, search, handleShow}) => {
  if (search === '') return null
  if (countries.length > 10) {
    return (
      <div>
        Too many matches, please be more specific
      </div>
    )
  }
  if (countries.length <= 10 && countries.length > 1) {
    return (
      <div>
        {countries.map(country => (
          <div key={country.name.common}>{country.name.common} <button onClick={() => handleShow(country)}>show</button></div>
        ))}
      </div>
    )
  } 
  return null
}

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null)
  useEffect (() => {
      axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital},${country.name.common}&appid=${process.env.REACT_APP_API_KEY}&units=imperial`)
      .then(response => setWeather(response.data))
      .catch(error => alert("error"))
  }, [country])
  if (!weather) return null
  return (
    <div>
      <div>temperature: {weather.main.temp} Fahrenheit</div>
      <div>{weather.weather[0].description}</div>
      <img
        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <div>wind: {weather.wind.speed} mph</div>
    </div>
  )
}

const Country = ({ country }) => {
  if (country.length !== 1) return null
  country = country[0]

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital: {country.capital}</div>
      <div>area: {country.area}</div>

      <h2>Languages:</h2>
      <ul>
        {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags.png} alt={`flag of ${country.name.common}`}></img>
      <h2>Weather in {country.capital}</h2>
      <Weather country={country} />
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState(null)
  const [search, setSearch] = useState('')

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data.sort((c1, c2) => {
          if (c1.name.common < c2.name.common) return -1
          if (c1.name.common > c2.name.common) return 1
          return 0
        }))
      })
      .catch(error => {
        alert('Unable to fetch data')
      })
  }, [])

  const countriesToShow = countries ? countries.filter(country => (
    country.name.common
      .toLowerCase()
      .includes(search.toLowerCase()))
    )
    : []

  return (
    <div>
      find countries <input onChange={handleSearch}/>
      <CountryList
        countries={countriesToShow}
        search={search}
        handleShow={(country) => setSearch(country.name.common)}
      />

      <Country country={countriesToShow} />

    </div>
  )
}

export default App;
