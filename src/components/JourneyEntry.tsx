"use client"

import React from 'react'
import { Button } from './ui/button'

// each entry in the journey history page rendered like this
const JourneyEntry = ({id, origin, dest, at, deleteFunc}: {id: string, origin: string, dest: string, at: string, deleteFunc: any}) => {
    return (
        <div className='justify-between text-xl border p-3 rounded-lg flex'>
            <div className=''>
                <h1>Origin: {origin}</h1>
                <h1>Destination: {dest}</h1>
                <h1>Date: {at}</h1>
            </div>
            <Button onClick={async () => { await deleteFunc() }} variant={"destructive"}>X</Button>

        </div>
    )
}

export default JourneyEntry