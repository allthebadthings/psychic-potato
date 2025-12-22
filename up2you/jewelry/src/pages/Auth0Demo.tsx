import { useAuth0 } from '@auth0/auth0-react'
import LoginButton from '../LoginButton'
import LogoutButton from '../LogoutButton'
import Profile from '../Profile'

export default function Auth0Demo() {
  const { isAuthenticated, isLoading, error } = useAuth0()

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold">Authentication Error</div>
          <div className="text-red-600 mt-2">{error.message}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-center">Auth0 Demo</h1>
        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="text-green-600 text-center font-medium">Authenticated</div>
            <Profile />
            <div className="flex justify-center">
              <LogoutButton />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-gray-600">Sign in to get started</p>
            <div className="flex justify-center">
              <LoginButton />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

