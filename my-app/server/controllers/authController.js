import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' })
    if (await User.findOne({ email }))
      return res.status(409).json({ message: 'Email already in use' })
    const user = await User.create({ name, email, password })
    res.status(201).json({ token: signToken(user._id), user: user.toSafeObject() })
  } catch (err) { next(err) }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' })
    res.json({ token: signToken(user._id), user: user.toSafeObject() })
  } catch (err) { next(err) }
}

export async function getMe(req, res) {
  res.json(req.user.toSafeObject())
}
