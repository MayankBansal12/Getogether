import { useUserStore } from '../global-store/store'
import { LoginEvent, SignupEvent } from '../pages/auth/auth'

const BACKEND = 'http://localhost:5000'

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

  public static async Signup(
    e: React.FormEvent<HTMLFormElement> & SignupEvent,
  ): Promise<boolean> {
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
        alert('Please fill all the fields')
        return false
      }

      if (password !== confirmPassword) {
        alert('Passwords do not match')
        return false
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
        return true
      } else {
        alert(data.message)
        return false
      }
    } catch (error) {
      return false
    }
  }

  public static async Login(
    e: React.FormEvent<HTMLFormElement> & LoginEvent,
  ): Promise<boolean> {
    try {
      const email = e.target.email.value
      const password = e.target.password.value

      console.log(email, password)

      if (!email || !password) {
        alert('Please fill all the fields')
        return false
      }

      const res = await fetch(`${BACKEND}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (res.ok) {
        // show data.message success message
        const token = data.token
        localStorage.setItem('token', token)
        return true
      } else {
        alert(data.message)
        return false
      }
    } catch (error) {
      return false
    }
  }
}

export default User
