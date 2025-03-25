import { useState } from 'react'

export default function HostelFilters({ onFilter }: any) {
  const [filters, setFilters] = useState({
    gender: '',
    hasMess: '',
    maxDistance: '',
  })

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value
    }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  return (
    <div className="filter-container">
      <select name="gender" onChange={handleFilterChange}>
        <option value="">All Genders</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
      </select>
      
      <select name="hasMess" onChange={handleFilterChange}>
        <option value="">Mess Availability</option>
        <option value="true">Has Mess</option>
        <option value="false">No Mess</option>
      </select>
      
      <input 
        type="number" 
        name="maxDistance" 
        placeholder="Max Distance (minutes)" 
        onChange={handleFilterChange}
      />
    </div>
  )
}