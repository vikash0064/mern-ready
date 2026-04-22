import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useApi } from '../hooks/useApi.js'
import { loginUser } from '../api/auth.js'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const { loading, error, call } = useApi(loginUser)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { token, user } = await call(form)
      login(token, user)
      nav('/dashboard')
    } catch {}
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-950 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-gray-900 border border-white/10 rounded-2xl p-8 flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-white">Sign in</h1>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
        <input className="input" placeholder="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
        <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Signing in…' : 'Sign in'}</button>
        <p className="text-gray-500 text-sm text-center">No account? <Link to="/register" className="text-cyan-400 hover:underline">Register</Link></p>
      </form>
    </main>
  )
}
