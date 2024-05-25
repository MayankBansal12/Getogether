import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import PageNotFound from '../page-not-found'
import Button from '../../components/button'
import { Link } from '@mui/material'
import Loader from '../../components/loader'
import User from '../../services/user'
import ImageUploader from '../../components/image-uploader'
import useSnackbar from '../../hooks/use-snackbar'
import ImageHelper from '../../services/image'

type Props = {}

export interface SignupEvent {
  target: {
    email: HTMLInputElement
    name: HTMLInputElement
    phone: HTMLInputElement
    about: HTMLTextAreaElement
    password: HTMLInputElement
    confirmPassword: HTMLInputElement
    image: HTMLInputElement
  }
}
export interface LoginEvent {
  target: {
    email: HTMLInputElement
    password: HTMLInputElement
  }
}

const Auth = (props: Props) => {
  const [loading, setLoading] = useState(false)
  const [query] = useSearchParams()
  const [redirectURL, setredirectURL] = useState<string | null>(null)
  const { authType } = useParams()
  const navigate = useNavigate()
  const setOpenSnackbar = useSnackbar()

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement> & LoginEvent,
  ) => {
    e.preventDefault()
    const loginSuccess = await User.Login(e)

    console.log(loginSuccess)

    setOpenSnackbar({
      open: true,
      content: loginSuccess.message,
      type: loginSuccess.type,
    })

    if (loginSuccess.success) {
      if (redirectURL) {
        navigate(redirectURL)
      } else navigate('/allevents')
    }
  }
  const handleSignup = async (
    e: React.FormEvent<HTMLFormElement> & SignupEvent,
  ) => {
    e.preventDefault()
    const signupSuccess = await User.Signup(e)

    setOpenSnackbar({
      open: true,
      content: signupSuccess.message,
      type: signupSuccess.type,
    })

    if (signupSuccess.success) {
      if (redirectURL) {
        navigate(redirectURL)
      } else navigate('/allevents')
    }
  }

  useEffect(() => {
    setredirectURL(query.get('redirect') || null)
  }, [query])

  if (authType !== 'login' && authType !== 'register') return <PageNotFound />
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex justify-center items-center py-20 w-full h-full font-josefin">
          <div className="flex-row border-2 border-primary-light px-2 md:px-10 py-4 md:py-10 text-center">
            <p className="py-3 text-xl md:text-3xl">
              Welcome to {''}
              <span className="font-title text-3xl md:text-5xl">
                Plan
                <span className="text-primary-light">it.</span>
                <span className="text-lg md:text-2xl">🙏</span>
              </span>
            </p>
            {!authType || authType === 'login' ? (
              <form onSubmit={handleLogin}>
                {/* login form */}
                <input
                  className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 min-w-60 md:min-w-80 focus:outline-none"
                  type="text"
                  placeholder="Email"
                  name="email"
                />
                <br />
                <input
                  className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 min-w-60 md:min-w-80 focus:outline-none"
                  type="password"
                  placeholder="Password"
                  name="password"
                />
                <br />
                <p className="py-4">
                  If you don’t have an account already.
                  <br /> Please{' '}
                  <Link
                    href={
                      redirectURL
                        ? `/auth/register?redirect=${redirectURL}`
                        : '/auth/register'
                    }
                  >
                    {' '}
                    Create an Account.
                  </Link>
                </p>
                <br />
                <Button onClick={() => {}} children={'Login'} />
              </form>
            ) : (
              <form
                onSubmit={handleSignup}
                encType="multipart/form-data"
                className="flex flex-col items-center"
              >
                {/* signup form */}
                <ImageUploader />
                <input
                  className="border-primary-light bg-background-light my-1 mt-2 px-2 py-1 border-b focus:border-b-2 min-w-60 md:min-w-80 focus:outline-none"
                  type="text"
                  placeholder="Email"
                  name="email"
                />
                <input
                  className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 min-w-60 md:min-w-80 focus:outline-none"
                  type="text"
                  placeholder="Name"
                  name="name"
                />
                <input
                  className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 min-w-60 md:min-w-80 focus:outline-none"
                  type="tel"
                  placeholder="Phone"
                  name="phone"
                />
                <textarea
                  className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 min-w-60 md:min-w-80 focus:outline-none"
                  placeholder="About"
                  name="about"
                />
                <input
                  className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 min-w-60 md:min-w-80 focus:outline-none"
                  type="password"
                  placeholder="Password"
                  name="password"
                />
                <input
                  className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 min-w-60 md:min-w-80 focus:outline-none"
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                />
                <p className="py-4">
                  If you have an account already.
                  <br /> Please{' '}
                  <Link
                    href={
                      redirectURL
                        ? `/auth/login?redirect=${redirectURL}`
                        : '/auth/login'
                    }
                  >
                    Login.
                  </Link>
                </p>
                <Button onClick={() => {}} children={'Signup'} />
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Auth
