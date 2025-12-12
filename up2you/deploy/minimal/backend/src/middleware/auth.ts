import type { Request, Response, NextFunction } from 'express'
import crypto from 'node:crypto'

function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {}
  const h = header || ''
  h.split(';').forEach(p => {
    const i = p.indexOf('=')
    if (i > -1) {
      const k = p.slice(0, i).trim()
      const v = p.slice(i + 1).trim()
      if (k) out[k] = v
    }
  })
  return out
}

function verifyAdminSession(token: string | undefined): boolean {
  if (!token) return false
  const secret = process.env.ADMIN_JWT_SECRET || ''
  if (!secret) return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [b64, sig] = parts
  if (!b64 || !sig) return false
  const expectedSig = crypto.createHmac('sha256', secret).update(b64).digest('base64url')
  if (sig !== expectedSig) return false
  try {
    const json = Buffer.from(b64, 'base64url').toString('utf8')
    const payload = JSON.parse(json)
    if (!payload.exp || typeof payload.exp !== 'number') return false
    if (payload.exp < Math.floor(Date.now() / 1000)) return false
    return true
  } catch {
    return false
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const cookies = parseCookies(req.header('cookie'))
  const sessionOk = verifyAdminSession(cookies['admin_session'])
  const headerToken = req.header('x-admin-token') || ''
  const expected = process.env.ADMIN_API_TOKEN || ''
  const headerOk = expected && headerToken === expected
  if (!sessionOk && !headerOk) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  next()
}
