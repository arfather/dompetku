'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock } from 'lucide-react'

const AUTH_COOKIE_NAME = 'dompetku_auth'
const VALID_USERNAME = 'arfin'
const VALID_PASSWORD = 'arfin'

export function AuthDialog({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split('; ')
      const authCookie = cookies.find(row => row.startsWith(`${AUTH_COOKIE_NAME}=`))
      setIsAuthenticated(!!authCookie)
    }
    checkAuth()
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      // Set cookie for 1 day
      const date = new Date()
      date.setTime(date.getTime() + (24 * 60 * 60 * 1000))
      document.cookie = `${AUTH_COOKIE_NAME}=true; expires=${date.toUTCString()}; path=/`
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Username atau password salah.')
    }
  }

  // Prevent flash by returning null while checking
  if (isAuthenticated === null) return null

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="fixed inset-0 z-100 bg-zinc-950 flex items-center justify-center p-4">
      <Dialog open={true}>
        <DialogContent className="sm:max-w-md [&>button]:hidden">
          <DialogHeader>
            <div className="mx-auto bg-primary/10 p-3 rounded-full mb-2 w-fit">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-center text-xl font-bold">Akses Terbatas</DialogTitle>
            <DialogDescription className="text-center">
              Silakan masukkan kredensial Anda untuk mengakses Dashboard DompetKu.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500 font-medium text-center">{error}</p>}
            <DialogFooter className="sm:justify-center">
              <Button type="submit" className="w-full">
                Masuk ke Aplikasi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
