import React from 'react'
import interviewA from '../assets/ai.jpg'

const Main = () => {


  return (
    <div>
    <div style={{width:"100%", display:"flex", justifyContent:"center"}}>
      <img src={`${interviewA}`} style={{width:"100%", maxWidth:"40rem", scale:1, transform:'translateY(-3rem)'}}/>
    </div>

<div>
  <textarea style={{backgroundColor:"white", width:"20rem", height:"10rem", padding:"1rem", borderRadius:"0.5rem"}} placeholder="Add Job Description" name="" id="" ></textarea>
  
</div>
    </div>
  )
}

export default Main