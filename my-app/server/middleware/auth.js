import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function protect(req, res, next) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' })
  try {
    const { id } = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET)
    req.user = await User.findById(id).select('-password')
    if (!req.user) return res.status(401).json({ message: 'User not found' })
    next()
  } catch {
    res.status(401).json({ message: 'Token invalid or expired' })
  }
}
