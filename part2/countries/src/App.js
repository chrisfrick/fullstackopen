import axios from 'axios'
import { useState, useEffect } from 'react'

const CountryList = ({ countries, search }) => {
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
        {countries.map(country => <div key={country.name.common}>{country.name.common}</div>)}
      </div>
    )
  } 
  return null
}

const Country = ({ country }) => {
  if (country.length !== 1) return null
  country = country[0]
  console.log(country)
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>

      <h2>languages:</h2>
      <ul>
        {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags.png} alt={`flag of ${country.name.common}`}></img>
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
      />

      <Country country={countriesToShow} />

    </div>
  )
}

export default App;
