"use client"
import React from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

// alot of the code here is from the documentation of the recharts library
// renders a graph based on the forecast data passed as props
const ForecastGraph = ({forecasts}: { forecasts: ForecastListItem[]}) => {
  return (
        <LineChart className='w-full'
          width={400}
          height={200}
          // forecasts temperatures are mapped go be 273 less to convert from kelvin.
          data={forecasts.map(item => ({
            ...item,
            // the date is substringed to cut out the date, as the temparatures will be hourly in only one day
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
          {/* data_txt is the attribute that refers to the date */}
          <XAxis dataKey="dt_txt" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="main.temp" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
  )
}

export default ForecastGraph