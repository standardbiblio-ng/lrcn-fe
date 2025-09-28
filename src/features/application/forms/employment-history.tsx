function EmploymentHistory() {
  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>Academic History</h2>
      <div>
        <label className='block text-sm'>Institution</label>
        <input type='text' className='w-full rounded border px-2 py-1' />
      </div>
      <div>
        <label className='block text-sm'>Qualification Obtained</label>
        <select className='w-full rounded border px-2 py-1'>
          <option>BSc</option>
          <option>MSc</option>
          <option>PhD</option>
        </select>
      </div>
      <div className='flex space-x-4'>
        <div>
          <label className='block text-sm'>Start Date</label>
          <input type='date' className='rounded border px-2 py-1' />
        </div>
        <div>
          <label className='block text-sm'>End Date</label>
          <input type='date' className='rounded border px-2 py-1' />
        </div>
      </div>
      <button className='mt-2 text-blue-600'>+ Click to Add Institution</button>
    </div>
  )
}

export default EmploymentHistory
