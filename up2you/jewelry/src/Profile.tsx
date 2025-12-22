import { useAuth0 } from '@auth0/auth0-react'

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0()

  if (isLoading) return <div>Loading profile...</div>

  if (!isAuthenticated || !user) return null

  return (
    <div className="flex flex-col items-center gap-3">
      <img
        src={user.picture || ''}
        alt={user.name || 'User'}
        className="w-24 h-24 rounded-full object-cover border-2 border-blue-400"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
        }}
      />
      <div className="text-center">
        <div className="text-lg font-semibold">{user.name}</div>
        <div className="text-sm text-gray-500">{user.email}</div>
      </div>
    </div>
  )
}

export default Profile

