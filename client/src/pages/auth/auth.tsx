import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import PageNotFound from '../page-not-found'

type Props = {}

const Auth = (props: Props) => {
  const [query] = useSearchParams()
  const [redirectURL, setredirectURL] = useState<string | null>(null)
  const { authType } = useParams()
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // login ka code likh lena

    // if redirect url exists
    if (redirectURL) {
      navigate(redirectURL)
    }
  }
  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  useEffect(() => {
    setredirectURL(query.get('redirect') || null)
  }, [query])

  if (authType !== 'login' && authType !== 'register') return <PageNotFound />
  return (
    <div className="flex flex-row w-full h-screen">
      <div className="flex flex-row justify-center items-center w-full">
        Image wala div or something
      </div>
      {!authType || authType === 'login' ? (
        <form onSubmit={handleLogin}>
          {/* login form */}
          <button type="submit" className="bg-blue-300 px-3 py-2 border">
            Kardo Submit
          </button>
        </form>
      ) : (
        <form onSubmit={handleSignup}>{/* signup form */}</form>
      )}
    </div>
  )
}

export default Auth
