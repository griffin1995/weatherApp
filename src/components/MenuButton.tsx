"use client"

import React, { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { NAV_URLS } from '@/lib/constants'
import { MenuIcon } from 'lucide-react'
import path from 'path'
import { Button, buttonVariants } from './ui/button'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

const MenuButton = () => {
  const path = usePathname()
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<undefined | string>("")

  useEffect(() => {
    supabase.auth.getUser()
    .then((u) => {
      setUser(u.data.user?.email)
    })
  }, [supabase.auth])

  return (
    <Sheet>
      <SheetTrigger className={buttonVariants({ variant: "outline" })}><MenuIcon /></SheetTrigger>
      <SheetContent side='left' className=" w-[400px] sm:w-[540px]">
        <div className='gap-y-2 mt-5 flex flex-col text-black text-left'>
          {NAV_URLS.map((url) => <Link className={buttonVariants({ variant: path == url.href ? "default" : "outline" })} key={url.href} href={url.href}>{url.title}</Link>)}
          {/* if user is not signed in, show sign in and make the onClick call supabase to sign in */}
          {user == undefined && <Button variant="outline" onClick={async () => {
            await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `http://example.com/auth/callback`,
              },
            })
            // router.refresh()
            
          }} >Login with Google</Button>}
        {/* if a user is signed in show the logout */}
        {user !== undefined && <Button variant="outline" onClick={async () => {
            await supabase.auth.signOut()
            setUser(undefined)
            
          }} >Logout</Button>}

          <h1>{user}</h1>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MenuButton
