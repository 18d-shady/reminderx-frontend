'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCookie } from 'cookies-next'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = getCookie('reminderx_access') // or whatever your cookie/session key is

    if (token) {
      router.replace('/dashboard')
    } else {
      router.replace('/login')
    }
  }, [router])

  return null // or a spinner if you like
}
