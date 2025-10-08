import React, { useState } from 'react'

function Recommendations() {
  const [photo, setPhoto] = useState<string | null>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setPhoto(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => setPhoto(null)

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

      <div className='flex space-x-4'>
        <div>
          <label className='block text-sm'>Select Designation</label>
          <select className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'>
            <option>C.E.O</option>
            <option>Director</option>
            <option>Supervisor</option>
          </select>
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

      <div>
        <label className='mb-2 block text-sm'>Passport Photograph</label>

        <div
          className={`bg-neutral2 relative mt-[12px] flex h-[150px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-[12px] border lg:h-[200px]`}
          style={{
            backgroundImage: photo ? `url(${photo})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {!photo && (
            <span className='text-sm text-gray-500'>Click to upload photo</span>
          )}

          <input
            type='file'
            accept='image/*'
            onChange={handlePhotoChange}
            className='absolute inset-0 cursor-pointer opacity-0'
          />

          {photo && (
            <button
              onClick={removePhoto}
              type='button'
              className='absolute top-2 right-2 rounded-md bg-black/50 px-2 py-1 text-xs text-white'
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Recommendations
