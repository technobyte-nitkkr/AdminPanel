'use client'

import { useEffect, useState } from 'react'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import firebase_app from './firebase.config'
import Image from 'next/image'
import { getUserByEmail } from '@/app/actions/users'
import { Toaster, toast } from 'react-hot-toast'

const auth = getAuth(firebase_app)
const SUPERADMIN_EMAIL = process.env.NEXT_PUBLIC_SUPERADMIN_EMAIL


export default function LoginPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const email = currentUser.email || ''
        try {
          const userData = await getUserByEmail(email)
          if (userData && userData.admin) {
            const token = await currentUser.getIdToken()
            document.cookie = `firebaseAuthToken=${token}; path=/; SameSite=Strict; Secure`
            if (email === SUPERADMIN_EMAIL) {
              document.cookie = `isSuperAdmin=true; path=/; SameSite=Strict; Secure`
            }
            setUser(currentUser)
            router.push('/')
          } else {
            toast.error('You do not have admin access')
            signOut(auth)
          }
        } catch (error) {
          toast.error('Error checking user permissions')
          signOut(auth)
        }
      } else {
        document.cookie = 'firebaseAuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        document.cookie = 'isSuperAdmin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        setUser(null)
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      setIsLoading(true)
      const result = await signInWithPopup(auth, provider)
      const email = result.user.email || ''
      const userData = await getUserByEmail(email)

      if (!userData || !userData.admin) {
        toast.error("You do not have admin access")
        signOut(auth)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unknown error occurred')
      }
      signOut(auth)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unknown error occurred')
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Toaster />
      <div className="w-full max-w-md bg-background rounded-xl shadow-md p-8 space-y-6 bg-white">
        {user ? (
          <div className="text-center bg-white">
            <div className="flex justify-center mb-4 bg-white">
              <Image
                src={user.photoURL || '/placeholder.svg'}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-blue-900 ">{user.displayName}</h2>
            <p className="text-gray-600 mb-4">{user.email}</p>
            <button
              onClick={handleSignOut}
              className="w-full bg-red-500 text-black py-2 rounded-lg hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-black">Admin Login</h1>
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition text-black"
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
          </div>
        )}
      </div>
    </div>
  )
}
