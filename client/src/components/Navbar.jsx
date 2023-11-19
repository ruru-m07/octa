import React from 'react'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { logout } = useAuth()
  return (
    <div>
      navbar
      <button onClick={() => {logout()}}>
        logout
      </button>
      <hr />
    </div>
  )
}

export default Navbar
