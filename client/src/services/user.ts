import { useUserStore } from '../global-store/store'

class User {
  public static async IsLoggedIn(): Promise<boolean> {
    // Check if token exists
    const token = localStorage.getItem('token')
    if (!token) {
      return false
    }

    // Check if user exists in global store
    const { user, setUser } = useUserStore.getState()
    if (user) return true

    try {
      const resp = await fetch('http://localhost:5000/auth/me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await resp.json()
      if (resp.ok) {
        setUser(data.user)
        return true
      } else {
        localStorage.removeItem('token')
        console.log('#IsLoggedIn:: Server error\n', data?.message)
        return false
      }
    } catch (error) {
      return false
    }
  }
}

export default User
