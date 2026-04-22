import path from 'path'
import fs from 'fs-extra'
import { execSync } from 'child_process'
import ora from 'ora'
import chalk from 'chalk'

function write(filePath, content) {
  fs.ensureDirSync(path.dirname(filePath))
  fs.writeFileSync(filePath, content, 'utf8')
}

function run(cmd, cwd) {
  try {
    execSync(cmd, { cwd, stdio: 'ignore' })
  } catch (e) {}
}

export async function scaffold(projectName) {
  const root = path.resolve(process.cwd(), projectName)
  if (fs.existsSync(root)) {
    console.log(chalk.red(`\n  ✗ Folder "${projectName}" exists.\n`))
    process.exit(1)
  }

  console.log(chalk.cyan(`\n  Building MERN MVC structure (Clean Version)...`))
  const spin = ora('Creating folders and files...').start()

  // 1. Root files
  write(path.join(root, 'package.json'), JSON.stringify({
    name: projectName,
    version: '1.0.0',
    type: 'module',
    private: true,
    scripts: {
      "dev": "concurrently \"npm run server\" \"npm run client\"",
      "server": "nodemon server/index.js",
      "client": "cd client && npm run dev"
    },
    dependencies: {
      "express": "^4.19.2",
      "mongoose": "^8.4.1",
      "dotenv": "^16.4.5",
      "cors": "^2.8.5",
      "morgan": "^1.10.0",
      "concurrently": "^8.2.2"
    },
    devDependencies: { "nodemon": "^3.1.4" }
  }, null, 2))

  write(path.join(root, '.env'), `PORT=5000\nMONGO_URI=mongodb://localhost:27017/${projectName}\nNODE_ENV=development`)
  write(path.join(root, '.gitignore'), "node_modules/\n.env\ndist/")

  // 2. Server MVC Structure
  const srv = (p) => path.join(root, 'server', p)
  
  write(srv('config/db.js'), `import mongoose from 'mongoose'\n\nexport const connectDB = async () => {\n  try {\n    await mongoose.connect(process.env.MONGO_URI)\n    console.log('MongoDB Connected')\n  } catch (error) {\n    console.error('Error:', error.message)\n    process.exit(1)\n  }\n}`)
  
  write(srv('controllers/userController.js'), `// Example Controller\nexport const getUsers = async (req, res) => {\n  res.json({ message: 'Get users route' })\n}`)
  
  write(srv('middleware/errorMiddleware.js'), `export const errorHandler = (err, req, res, next) => {\n  const statusCode = res.statusCode === 200 ? 500 : res.statusCode\n  res.status(statusCode).json({\n    message: err.message,\n    stack: process.env.NODE_ENV === 'production' ? null : err.stack,\n  })\n}`)
  
  write(srv('models/User.js'), `import mongoose from 'mongoose'\n\nconst userSchema = new mongoose.Schema({\n  name: { type: String, required: true },\n  email: { type: String, required: true, unique: true },\n}, { timestamps: true })\n\nexport default mongoose.model('User', userSchema)`)
  
  write(srv('routes/userRoutes.js'), `import express from 'express'\nimport { getUsers } from '../controllers/userController.js'\n\nconst router = express.Router()\n\nrouter.route('/').get(getUsers)\n\nexport default router`)
  
  write(srv('utils/helpers.js'), `// Add your helper functions here\nexport const exampleHelper = () => 'Hello'`)

  write(srv('index.js'), `import 'dotenv/config'\nimport express from 'express'\nimport cors from 'cors'\nimport morgan from 'morgan'\nimport { connectDB } from './config/db.js'\nimport { errorHandler } from './middleware/errorMiddleware.js'\nimport userRoutes from './routes/userRoutes.js'\n\nconst app = express()\n\n// Connect DB\nconnectDB()\n\n// Middleware\napp.use(cors())\napp.use(express.json())\napp.use(morgan('dev'))\n\n// Routes\napp.use('/api/users', userRoutes)\napp.get('/api', (req, res) => res.json({ message: 'API is running' }))\n\n// Error Handler\napp.use(errorHandler)\n\nconst PORT = process.env.PORT || 5000\napp.listen(PORT, () => console.log(\`Server running on port \${PORT}\`))`)


  // 3. Client Structure
  const cli = (p) => path.join(root, 'client', p)
  write(cli('package.json'), JSON.stringify({
    name: "client",
    private: true,
    type: "module",
    scripts: { "dev": "vite", "build": "vite build" },
    dependencies: { "react": "^18.3.1", "react-dom": "^18.3.1", "axios": "^1.7.2", "react-router-dom": "^6.23.1" },
    devDependencies: { "vite": "^5.3.1", "@vitejs/plugin-react": "^4.3.0", "tailwindcss": "^4.0.0", "@tailwindcss/vite": "^4.0.0" }
  }, null, 2))

  write(cli('vite.config.js'), `import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\nimport tailwindcss from '@tailwindcss/vite'\n\nexport default defineConfig({\n  plugins: [react(), tailwindcss()],\n  server: { proxy: { '/api': 'http://localhost:5000' } }\n})`)
  write(cli('index.html'), `<!doctype html><html><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>`)
  write(cli('src/index.css'), `@import "tailwindcss";`)
  
  // Empty folders for client architecture
  fs.ensureDirSync(cli('src/components'))
  fs.ensureDirSync(cli('src/context'))
  fs.ensureDirSync(cli('src/hooks'))
  fs.ensureDirSync(cli('src/assets'))
  fs.ensureDirSync(cli('src/utils'))

  write(cli('src/api/axios.js'), `import axios from 'axios'\n\nconst API = axios.create({ baseURL: '/api' })\nexport default API`)
  write(cli('src/pages/Home.jsx'), `export default function Home() {\n  return (\n    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">\n      <h1 className="text-4xl font-bold text-cyan-400">Home Page</h1>\n      <p className="mt-4 text-gray-400">Start building your UI here.</p>\n    </div>\n  )\n}`)
  write(cli('src/App.jsx'), `import { BrowserRouter, Routes, Route } from 'react-router-dom'\nimport Home from './pages/Home'\n\nexport default function App() {\n  return (\n    <BrowserRouter>\n      <Routes>\n        <Route path="/" element={<Home />} />\n      </Routes>\n    </BrowserRouter>\n  )\n}`)
  write(cli('src/main.jsx'), `import React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport App from './App.jsx'\nimport './index.css'\n\nReactDOM.createRoot(document.getElementById('root')).render(<App />)`)

  spin.succeed(chalk.green('Folder structure ready.'))
  
  const spin2 = ora('Installing dependencies...').start()
  run('npm install', root)
  run('npm install', path.join(root, 'client'))
  spin2.succeed(chalk.green('Done.'))

  console.log(chalk.cyan(`\n  Project scaffolded successfully!\n  Next steps:\n    cd ${projectName}\n    npm run dev\n`))
}
