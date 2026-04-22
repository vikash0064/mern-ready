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

  console.log(chalk.cyan(`\n  Building clean MERN stack...`))
  const spin = ora('Creating files...').start()

  // 1. Root package.json (Fixed type: module)
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

  write(path.join(root, '.env'), `PORT=5000\nMONGO_URI=mongodb://localhost:27017/${projectName}`)
  write(path.join(root, '.gitignore'), "node_modules/\n.env\ndist/")

  // 2. Server (Minimal)
  const srv = (p) => path.join(root, 'server', p)
  write(srv('index.js'), `import 'dotenv/config'\nimport express from 'express'\nimport cors from 'cors'\nimport mongoose from 'mongoose'\n\nconst app = express()\napp.use(cors())\napp.use(express.json())\n\nmongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB Connected'))\n\napp.get('/api', (req, res) => res.json({ message: 'Server is running' }))\n\napp.listen(5000, () => console.log('Server: http://localhost:5000'))`)

  // 3. Client (Clean Vite + Tailwind v4)
  const cli = (p) => path.join(root, 'client', p)
  write(cli('package.json'), JSON.stringify({
    name: "client",
    private: true,
    type: "module",
    scripts: { "dev": "vite", "build": "vite build" },
    dependencies: { "react": "^18.3.1", "react-dom": "^18.3.1", "axios": "^1.7.2" },
    devDependencies: { "vite": "^5.3.1", "@vitejs/plugin-react": "^4.3.0", "tailwindcss": "^4.0.0", "@tailwindcss/vite": "^4.0.0" }
  }, null, 2))

  write(cli('vite.config.js'), `import { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\nimport tailwindcss from '@tailwindcss/vite'\n\nexport default defineConfig({\n  plugins: [react(), tailwindcss()],\n  server: { proxy: { '/api': 'http://localhost:5000' } }\n})`)
  write(cli('index.html'), `<!doctype html><html><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>`)
  write(cli('src/index.css'), `@import "tailwindcss";`)
  write(cli('src/main.jsx'), `import React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport App from './App.jsx'\nimport './index.css'\n\nReactDOM.createRoot(document.getElementById('root')).render(<App />)`)
  write(cli('src/App.jsx'), `import { useEffect, useState } from 'react'\nimport axios from 'axios'\n\nexport default function App() {\n  const [msg, setMsg] = useState('Loading...')\n  useEffect(() => { axios.get('/api').then(r => setMsg(r.data.message)) }, [])\n\n  return (\n    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">\n      <h1 className="text-4xl font-bold mb-4 text-cyan-400">MERN Ready</h1>\n      <p className="text-gray-400 text-lg">{msg}</p>\n      <div className="mt-8 grid grid-cols-2 gap-4 text-sm font-mono">\n        <div className="p-4 bg-white/5 rounded border border-white/10">Server: 5000</div>\n        <div className="p-4 bg-white/5 rounded border border-white/10">Client: 5173</div>\n      </div>\n    </div>\n  )\n}`)

  spin.succeed(chalk.green('Structure ready.'))
  
  const spin2 = ora('Installing deps...').start()
  run('npm install', root)
  run('npm install', path.join(root, 'client'))
  spin2.succeed(chalk.green('Done.'))

  console.log(chalk.cyan(`\n  Next: cd ${projectName} && npm run dev\n`))
}
