import { useState } from 'react'

interface Institution {
  institution: string
  qualification: string
  startDate: string
  endDate: string
}

function AcademicHistory() {
  const [institutions, setInstitutions] = useState<Institution[]>([
    { institution: '', qualification: '', startDate: '', endDate: '' },
  ])

  const handleAddInstitution = () => {
    setInstitutions([
      ...institutions,
      { institution: '', qualification: '', startDate: '', endDate: '' },
    ])
  }

  const handleChange = (
    index: number,
    field: keyof Institution,
    value: string
  ) => {
    const updated = [...institutions]
    updated[index][field] = value
    setInstitutions(updated)
  }

  const handleRemoveInstitution = (index: number) => {
    const updated = institutions.filter((_, i) => i !== index)
    setInstitutions(updated)
  }

  return (
    <div className='space-y-6'>
      <h2 className='font-montserrat mb-1 text-xl font-semibold'>
        Academic History
      </h2>
      <h4 className='font-montserrat text-md text-active font-normal'>
        List all tertiary institutions attended starting from the most recent.
      </h4>

      {institutions.map((item, index) => (
        <div
          key={index}
          className='space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4'
        >
          <div className='flex items-center justify-between'>
            <p className='font-montserrat text-base font-bold'>
              Tertiary Institution {index + 1}
            </p>
            {institutions.length > 1 && (
              <button
                onClick={() => handleRemoveInstitution(index)}
                className='text-sm font-medium text-red-500 hover:underline'
              >
                Remove
              </button>
            )}
          </div>

          <div>
            <label className='block text-sm'>Institution</label>
            <input
              type='text'
              value={item.institution}
              onChange={(e) =>
                handleChange(index, 'institution', e.target.value)
              }
              placeholder='Enter institution name'
              className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
            />
          </div>

          <div>
            <label className='block text-sm'>Qualification Obtained</label>
            <select
              value={item.qualification}
              onChange={(e) =>
                handleChange(index, 'qualification', e.target.value)
              }
              className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
            >
              <option value=''>Select qualification</option>
              <option>BSc</option>
              <option>MSc</option>
              <option>PhD</option>
              <option>HND</option>
              <option>OND</option>
            </select>
          </div>

          <div className='flex space-x-4'>
            <div className='flex-1'>
              <label className='block text-sm'>Start Date</label>
              <input
                type='date'
                value={item.startDate}
                onChange={(e) =>
                  handleChange(index, 'startDate', e.target.value)
                }
                className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
              />
            </div>
            <div className='flex-1'>
              <label className='block text-sm'>End Date</label>
              <input
                type='date'
                value={item.endDate}
                onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={handleAddInstitution}
        className='text-mainGreen flex items-center font-medium hover:text-green-700'
      >
        <span className='bg-mainGreen mr-2 flex h-6 w-6 items-center justify-center rounded-full text-lg text-white'>
          +
        </span>
        Add Another Institution
      </button>
    </div>
  )
}

export default AcademicHistory
