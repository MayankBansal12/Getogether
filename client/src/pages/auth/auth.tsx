import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import PageNotFound from '../page-not-found'
import Button from '../../components/button'
import { Link } from '@mui/material'
import Loader from '../../components/loader'

type Props = {}

const Auth = (props: Props) => {
  const [loading, setLoading] = useState(true)
  const [query] = useSearchParams()
  const [redirectURL, setredirectURL] = useState<string | null>(null)
  const { authType } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }, [])

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // login ka code likh lena
    console.log('Login')
    // if redirect url exists
    if (redirectURL) {
      navigate(redirectURL)
    }
  }
  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('signup')
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
        <div className="flex  w-full h-full justify-center items-center font-josefin py-20">
          <div className="flex-row text-center border-2 border-primary-light py-4 px-2 md:py-10 md:px-10 ">
            <p className="text-xl md:text-3xl py-3">
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
                  className="min-w-60 md:min-w-80 px-2 py-1 my-1 border-b border-primary-light bg-background-light focus:outline-none focus:border-b-2"
                  type="text"
                  placeholder="Email"
                />
                <br />
                <input
                  className="min-w-60 md:min-w-80 px-2 py-1 my-1 border-b border-primary-light bg-background-light focus:outline-none focus:border-b-2"
                  type="password"
                  placeholder="Password"
                />
                <br />
                <p className="py-4">
                  If you don’t have an account already.
                  <br /> Please{' '}
                  <Link href="/auth/register"> Create an Account.</Link>
                </p>
                <br />
                <Button onClick={() => {}} children={'Login'} />
              </form>
            ) : (
              <form onSubmit={handleSignup}>
                {/* signup form */}{' '}
                <input
                  className="min-w-60 md:min-w-80 px-2 py-1 my-1 border-b border-primary-light bg-background-light focus:outline-none focus:border-b-2"
                  type="text"
                  placeholder="Email"
                />
                <br />
                <input
                  className="min-w-60 md:min-w-80 px-2 py-1 my-1 border-b border-primary-light bg-background-light focus:outline-none focus:border-b-2"
                  type="password"
                  placeholder="Password"
                />
                <br />
                <input
                  className="min-w-60 md:min-w-80 px-2 py-1 my-1 border-b border-primary-light bg-background-light focus:outline-none focus:border-b-2"
                  type="password"
                  placeholder="Confirm Password"
                />
                <br />
                <p className="py-4">
                  If you have an account already.
                  <br /> Please <Link href="/auth/login">Login.</Link>
                </p>
                <br />
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
