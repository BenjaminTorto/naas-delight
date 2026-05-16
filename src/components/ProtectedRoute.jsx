import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    // 1. Get the initial session state right away
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    // 2. Listen live for when they click "Sign Out" or log in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  // While checking, render nothing to prevent UI flashes
  if (session === undefined) return null
  
  // If no session exists, bounce them to login
  if (!session) return <Navigate to="/admin-login" replace />
  
  return children
}

export default ProtectedRoute
