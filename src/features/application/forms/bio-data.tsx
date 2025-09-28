function BioData() {
  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>Academic History</h2>
      <h4 className='text-md font-medium'>Please fill out all fields.</h4>

      <div>
        <label className='block text-sm'>First Name</label>
        <input
          type='text'
          placeholder='Enter first name'
          className='w-full rounded border px-2 py-1'
        />
      </div>
      <div>
        <label className='block text-sm'>Last Name</label>
        <input
          type='text'
          placeholder='Enter last name'
          className='w-full rounded border px-2 py-1'
        />
      </div>
      <div>
        <label className='block text-sm'>Others Names</label>
        <input
          type='text'
          placeholder='Enter other names'
          className='w-full rounded border px-2 py-1'
        />
      </div>
      <div>
        <label className='block text-sm'>Previous Names</label>
        <input
          type='text'
          placeholder='Enter previous names'
          className='w-full rounded border px-2 py-1'
        />
      </div>

      <div className='flex flex-wrap space-x-4'>
        <div>
          <label className='block text-sm'>Email </label>
          <input
            type='email'
            placeholder='Enter your email'
            className='w-full rounded border px-2 py-1'
          />
        </div>
        <div>
          <label className='block text-sm'>Phone Number</label>
          <input
            type='tel'
            placeholder='Enter your phone number'
            className='w-full rounded border px-2 py-1'
          />
        </div>
      </div>

      <div>
        <label className='block text-sm'>Nationality</label>
        <select className='w-full rounded border px-2 py-1'>
          <option>Nigerian</option>
          <option>American</option>
          <option>British</option>
        </select>
      </div>

      <div className='flex space-x-4'>
        <div>
          <label className='block text-sm'>D.O.B</label>
          <input type='date' className='rounded border px-2 py-1' />
        </div>
        <div>
          <label className='block text-sm'>Gender</label>
          <select className='w-full rounded border px-2 py-1'>
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default BioData
