import React, { useEffect } from 'react'

const Profile = () => {

  useEffect(() => {
    const transcriptLog: string | null = localStorage.getItem('InterviewTranscript');
  }, [])
  


  return (
    <div>
      Profile
    </div>
  )
}

export default Profile