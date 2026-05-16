import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      // Adjusted to match your App.jsx route definition exactly
      navigate('/admin')
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0C0C0C', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '140px 2rem 4rem', position: 'relative', zIndex: 10 }}>
      <div style={{ maxWidth: '400px', width: '100%', backgroundColor: '#111111', border: '1px solid rgba(201,168,76,0.15)', padding: '2.5rem', textAlign: 'center' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ width: '16px', height: '1px', backgroundColor: '#C9A84C' }} />
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C9A84C' }}>Internal Access</span>
          <div style={{ width: '16px', height: '1px', backgroundColor: '#C9A84C' }} />
        </div>

        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: '#F0EAD6', marginBottom: '2rem' }}>
          Admin Portal
        </h1>

        {error && (
          <div style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)', border: '1px solid rgba(255, 0, 0, 0.3)', color: '#ff6b6b', padding: '0.75rem', fontSize: '0.75rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8A7E6A', display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', backgroundColor: '#171717', border: '1px solid rgba(201,168,76,0.1)', padding: '0.75rem', color: '#F0EAD6', fontSize: '0.85rem', outline: 'none' }}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8A7E6A', display: 'block', marginBottom: '0.5rem' }}>Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', backgroundColor: '#171717', border: '1px solid rgba(201,168,76,0.1)', padding: '0.75rem', color: '#F0EAD6', fontSize: '0.85rem', outline: 'none' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ backgroundColor: '#C9A84C', color: '#0C0C0C', border: 'none', padding: '0.8rem', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1rem', transition: 'all 0.2s ease' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
