"use client"

import { Database } from '@/utils/supabase-types'
import { createClient } from '@/utils/supabase/client'
import React from 'react'
import JourneyEntry from './JourneyEntry'
import { useRouter } from 'next/navigation'

const JourneyList = ({journeys}: {journeys: any}) => {
    const router = useRouter()
    const client = createClient()
  return (
    <div className='flex flex-col  mt-5 gap-y-5'>
      {
        journeys.data.map((item: { id: any; origin: any; destination: any; created_at: any }) =>
          <JourneyEntry id={item.id} origin={item.origin} 
          // each entry needs a X button for deletion by id
          dest={item.destination} key={item.id} at={item.created_at} deleteFunc={async () => {await client.from("journeys").delete().eq("id", item.id); router.refresh()}}/>)}</div>
  )
}

export default JourneyList