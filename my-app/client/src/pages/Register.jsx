import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useApi } from '../hooks/useApi.js'
import { registerUser } from '../api/auth.js'

export default function Register() {
  const { login } = useAuth()
  const nav = useNavigate()
  const { loading, error, call } = useApi(registerUser)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

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
        <h1 className="text-2xl font-bold text-white">Create account</h1>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <input className="input" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        <input className="input" placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
        <input className="input" placeholder="Password (min 6)" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
        <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Creating…' : 'Create account'}</button>
        <p className="text-gray-500 text-sm text-center">Have an account? <Link to="/login" className="text-cyan-400 hover:underline">Sign in</Link></p>
      </form>
    </main>
  )
}
