import React, { useState } from 'react'

function Recommendations() {
  return (
    <div className='space-y-4'>
      <h2 className='font-montserrat mb-1 text-xl font-semibold'>
        Document Upload
      </h2>
      <h4 className='font-montserrat text-md text-active font-normal'>
        Please fill out all fields.
      </h4>

      <div>
        <label className='block text-sm'>Name</label>
        <input
          type='text'
          placeholder='Name'
          className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
        />
      </div>

      <div>
        <label className='block text-sm'>Email</label>
        <input
          type='email'
          placeholder='Enter email'
          className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
        />
      </div>

      <div>
        <label className='block text-sm'>Phone Number</label>
        <input
          type='tel'
          placeholder='Phone Number'
          className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
        />
      </div>
    </div>
  )
}

export default Recommendations
