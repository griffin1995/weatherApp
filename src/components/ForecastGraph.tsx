"use client"
import React from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const ForecastGraph = ({forecasts}: { forecasts: ForecastListItem[]}) => {
  return (
        <LineChart className='w-full'
          width={400}
          height={200}
          data={forecasts.map(item => ({
            ...item,
            dt_txt: item.dt_txt.substring(11, 16),
            main: {
                ...item.main,
                temp: item.main.temp - 273,
                temp_min: item.main.temp_min - 273,
                temp_max: item.main.temp_max - 273,
                feels_like: item.main.feels_like - 273
            }
        }))}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dt_txt" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="main.temp" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
  )
}

export default ForecastGraph