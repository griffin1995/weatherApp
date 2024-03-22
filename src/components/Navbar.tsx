"use client"

import React, { useState } from 'react'
import {  SearchIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useToast } from './ui/use-toast'
import { useRouter } from 'next/navigation'
import MenuButton from './MenuButton'

const Navbar = () => {

    const [search, setSearch] = useState("")
    const { toast } = useToast()
    const router = useRouter()



    const handleSearch = () => {
        // reject empty searches
        if (search.trim() == "" || search == null || search.trim().length == 0) {
            toast({
                title: "Enter a valid location!"
            })
            return
        }
        // the pages at the root + /name lead to info about the named location
        router.push("/" + search.trim())

    }
    return (
        <div className='flex '>
            <MenuButton/>

            <Input onKeyDown={(e) => {if (e.key == "Enter") handleSearch()} } onChange={(e) => setSearch(e.target.value)} placeholder='Search by location'/>
            <Button onClick={handleSearch} variant={"outline"}><SearchIcon/></Button>

        </div>
    )
}

export default Navbar