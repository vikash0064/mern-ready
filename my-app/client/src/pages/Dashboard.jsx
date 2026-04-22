import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  const handleLogout = () => { logout(); nav('/') }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button onClick={handleLogout} className="px-4 py-2 rounded-lg border border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition text-sm">
            Sign out
          </button>
        </div>
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-1">Logged in as</p>
          <p className="text-xl font-semibold">{user?.name}</p>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
      </div>
    </main>
  )
}
