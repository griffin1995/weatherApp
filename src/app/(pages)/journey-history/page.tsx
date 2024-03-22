import JourneyEntry from '@/components/JourneyEntry'
import JourneyList from '@/components/JourneyList'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import React from 'react'

const JourneyHistory = async () => {

  const client = createClient()
  const user = await client.auth.getUser()
  const journeys = await client.from("journeys").select()

  if (!user.data.user) {
    return <h1 className='mt-10 text-center text-3xl'>You must be signed in!</h1>
  }

  if (journeys.data?.length == 0 || !journeys.data) {
    return <h1 className='mt-10 text-center text-3xl'>No Journeys</h1>
  }
  return (
    <JourneyList journeys={journeys}/>
  )
}

export default JourneyHistory