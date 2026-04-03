import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import http from 'node:http'

const root = join(process.cwd(), 'dist')
const port = Number(process.env.PORT || 80)

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

const sendFile = (res, filePath) => {
  const ext = extname(filePath).toLowerCase()
  const contentType = contentTypes[ext] || 'application/octet-stream'

  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
  })

  createReadStream(filePath).pipe(res)
}

http
  .createServer((req, res) => {
    const requestPath = normalize(decodeURIComponent(req.url || '/')).replace(/^(\.\.[/\\])+/, '')
    const targetPath = join(root, requestPath === '/' ? 'index.html' : requestPath)

    if (existsSync(targetPath) && statSync(targetPath).isFile()) {
      sendFile(res, targetPath)
      return
    }

    const indexPath = join(root, 'index.html')
    if (existsSync(indexPath)) {
      sendFile(res, indexPath)
      return
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Not Found')
  })
  .listen(port, '0.0.0.0', () => {
    console.log(`Static server listening on ${port}`)
  })
