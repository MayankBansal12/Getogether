import { useUserStore } from '../global-store/store'
import { LoginEvent, SignupEvent } from '../pages/auth/auth'

const BACKEND = 'http://localhost:5000'

interface AuthSuccess {
  success: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

class User {
  public static async IsLoggedIn(): Promise<boolean> {
    // Check if token exists
    const token = localStorage.getItem('token')
    if (!token) {
      console.log('No token')
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

  public static async Signup(
    e: React.FormEvent<HTMLFormElement> & SignupEvent,
  ): Promise<AuthSuccess> {
    try {
      const email = e.target.email.value
      const name = e.target.name.value
      const phone = e.target.phone.value
      const about = e.target.about.value
      const password = e.target.password.value
      const confirmPassword = e.target.confirmPassword.value

      if (
        !email ||
        !name ||
        !phone ||
        !about ||
        !password ||
        !confirmPassword
      ) {
        return {
          success: false,
          message: 'All the fields are required',
          type: 'info',
        }
      }

      if (password !== confirmPassword) {
        return {
          success: false,
          message: 'Passwords do not match',
          type: 'error',
        }
      }

      const res = await fetch(`${BACKEND}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, phone, about, password }),
      })

      const data = await res.json()
      if (res.ok) {
        // show data.message success message
        const token = data.token
        localStorage.setItem('token', token)
        return {
          success: true,
          message: data?.message || 'Login success',
          type: 'success',
        }
      } else {
        return {
          success: false,
          message: data?.message || data?.error,
          type: 'error',
        }
      }
    } catch (error) {
      console.log(error)
      return { success: false, message: 'Some error occured', type: 'error' }
    }
  }

  public static async Login(
    e: React.FormEvent<HTMLFormElement> & LoginEvent,
  ): Promise<AuthSuccess> {
    try {
      const email = e.target.email.value
      const password = e.target.password.value

      console.log(email, password)

      if (!email || !password) {
        return {
          success: false,
          message: 'All the fields are required',
          type: 'info',
        }
      }

      const res = await fetch(`${BACKEND}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      console.log(data)
      if (res.ok) {
        // show data.message success message
        const token = data.token
        localStorage.setItem('token', token)
        return {
          success: true,
          message: data?.message || 'Login success',
          type: 'success',
        }
      } else {
        console.log(data?.message)
        return {
          success: false,
          message: data?.message || data?.error || 'Error occured',
          type: 'error',
        }
      }
    } catch (error) {
      console.log(error)
      return { success: false, message: 'Some error occured', type: 'error' }
    }
  }
}

export default User
