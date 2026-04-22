import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white gap-6 p-6">
      <h1 className="text-5xl font-bold tracking-tight">Welcome to my-app</h1>
      <p className="text-gray-400 text-lg">Your MERN app is ready. Start building.</p>
      <div className="flex gap-4">
        <Link to="/register" className="px-6 py-2.5 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition">Get started</Link>
        <Link to="/login"    className="px-6 py-2.5 rounded-lg border border-white/20 text-gray-300 hover:text-white transition">Sign in</Link>
      </div>
    </main>
  )
}
