import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/brain.webp'
import useAuthCall from '../hooks/useAuthCall'
import '../styles/Header.css'
const Header = () => {

  const { currentUser } = useSelector((state: any) => state.auth)

  const { logout } = useAuthCall()
  const navigate = useNavigate()

  const signOut = () => {
    logout()
    navigate('/')
  }

  return (
    <div className='main'>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <img src={`${logo}`} style={{ width: "44px", borderRadius: "50%" }} alt="logo" />
        <h3 style={{ fontWeight: "600", fontSize: "1.3rem", color: "white" }}>
          XpertAI
        </h3>
      </div>
{
  currentUser ?
<button className="btn-header" onClick={signOut}>
  Sign Off
  <div className="icon">
    <svg
      height="20"
      width="20"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0z" fill="none"></path>
      <path
        d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
        fill="currentColor"
      ></path>
    </svg>
  </div>
</button>
      :""
}

    </div>
  )
}

export default Header