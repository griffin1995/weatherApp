import React from 'react'

const InfoIcon = ({icon, value, units}: {icon: string, value: string, units:string}) => {
    return (
        <div className='flex gap-y-2 flex-col items-center justify-center'>
            <h1 className='text-xl'>{icon}</h1>
            <p className='text-lg font-bold'>{value}{units}</p>
        </div>
    )
}

export default InfoIcon