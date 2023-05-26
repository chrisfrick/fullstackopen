import { filterChange } from '../reducers/filterReducer'
import { useDispatch } from 'react-redux'

const VisibilityFilter = (propr) => {
  const dispatch = useDispatch()

  return (
    <div>
      <div>
        all
        <input
          type="radio"
          name="filter"
          onChange={() => dispatch(filterChange('ALL'))}
        />
        important
        <input
          type="radio"
          name="filter"
          onChange={() => dispatch(filterChange('IMPORTANT'))}
        />
        nonimportant
        <input
          type="radio" 
          name="filter"
          onChange={() => dispatch(filterChange('NONIMPORTANT'))}
        />
      </div>
    </div>
  )
}

export default VisibilityFilter
