import type { Request, Response, NextFunction } from 'express'

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const tokenHeader = req.header('x-admin-token') || ''
  const expected = process.env.ADMIN_API_TOKEN || ''
  if (!expected) {
    res.status(500).json({ error: 'ADMIN_API_TOKEN not configured' })
    return
  }
  if (tokenHeader !== expected) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  next()
}
