import React from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthCall from '../hooks/useAuthCall'

const Main = () => {
  const {logout}=useAuthCall()
  const navigate=useNavigate()

  const signOut=()=>{
    logout()
    navigate('/')
  }

  return (
    <div>
      <button onClick={signOut} >Sign Out</button>
    </div>
  )
}

export default Main