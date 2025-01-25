'use client'

import { useEffect, useState } from 'react'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import firebase_app from './firebase.config'
import Image from 'next/image'

const auth = getAuth(firebase_app)
const ALLOWED_DOMAIN = '@nitkkr.ac.in'

export default function LoginPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const email = currentUser.email || ''
        if (email.endsWith(ALLOWED_DOMAIN)) {
          const token = await currentUser.getIdToken()
          document.cookie = `firebaseAuthToken=${token}; path=/; SameSite=Strict; Secure`
          
          setUser(currentUser)
          router.push('/')
        } else {
          setError(`Only ${ALLOWED_DOMAIN} emails are allowed`)
          signOut(auth)
        }
      } else {
        document.cookie = 'firebaseAuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        setUser(null)
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      setIsLoading(true)
      setError('')
      const result = await signInWithPopup(auth, provider)
      const email = result.user.email || ''
      
      if (!email.endsWith(ALLOWED_DOMAIN)) {
        throw new Error(`Only ${ALLOWED_DOMAIN} emails are allowed`)
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred')
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 space-y-6">
        {user ? (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Image 
                src={user.photoURL || '/placeholder.svg'}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">{user.displayName}</h2>
            <p className="text-gray-600 mb-4">{user.email}</p>
            <button 
              onClick={handleSignOut}
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome</h1>
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>
            {error && (
              <p className="text-red-500 mt-2">{error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}