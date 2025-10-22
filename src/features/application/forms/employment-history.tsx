import { useState } from 'react'

interface WorkExperience {
  organization: string
  position: string
  startDate: string
}

interface EmploymentInfo {
  employer: string
  address: string
  status: string
  categories: string[]
  workExperiences: WorkExperience[]
}

function EmploymentHistory() {
  const [employment, setEmployment] = useState<EmploymentInfo>({
    employer: '',
    address: '',
    status: '',
    categories: [],
    workExperiences: [{ organization: '', position: '', startDate: '' }],
  })

  // handle field updates
  const handleChange = (field: keyof EmploymentInfo, value: any) => {
    setEmployment({ ...employment, [field]: value })
  }

  // handle category (checkbox)
  const handleCategoryToggle = (category: string) => {
    const updatedCategories = employment.categories.includes(category)
      ? employment.categories.filter((c) => c !== category)
      : [...employment.categories, category]

    setEmployment({ ...employment, categories: updatedCategories })
  }

  // add another work experience
  const handleAddExperience = () => {
    setEmployment({
      ...employment,
      workExperiences: [
        ...employment.workExperiences,
        { organization: '', position: '', startDate: '' },
      ],
    })
  }

  // handle experience field change
  const handleExperienceChange = (
    index: number,
    field: keyof WorkExperience,
    value: string
  ) => {
    const updated = [...employment.workExperiences]
    updated[index][field] = value
    setEmployment({ ...employment, workExperiences: updated })
  }

  const handleRemoveExperience = (index: number) => {
    const updated = employment.workExperiences.filter((_, i) => i !== index)
    setEmployment({ ...employment, workExperiences: updated })
  }

  return (
    <div className='space-y-6'>
      <h2 className='font-montserrat mb-1 text-xl font-semibold'>
        Current Employment
      </h2>
      <h4 className='font-montserrat text-md text-active font-normal'>
        Please fill out all fields.
      </h4>

      {/* Employer Info */}
      <div>
        <label className='block text-sm'>Employer</label>
        <input
          type='text'
          placeholder='Name of the employer'
          value={employment.employer}
          onChange={(e) => handleChange('employer', e.target.value)}
          className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
        />
      </div>

      <div>
        <label className='block text-sm'>Address</label>
        <input
          type='text'
          placeholder='Address of the employer'
          value={employment.address}
          onChange={(e) => handleChange('address', e.target.value)}
          className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
        />
      </div>

      <div className='flex space-x-4'>
        <div className='flex-1'>
          <label className='block text-sm'>Status</label>
          <select
            value={employment.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
          >
            <option value=''>Select status</option>
            <option>Married</option>
            <option>Single</option>
          </select>
        </div>

        <div className='flex-1'>
          <label className='block text-sm'>Start Date</label>
          <input
            type='date'
            className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
          />
        </div>
      </div>

      {/* Work Experience Section */}
      <p className='font-montserrat text-base font-bold'>Work Experience</p>

      {employment.workExperiences.map((exp, index) => (
        <div
          key={index}
          className='space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4'
        >
          <div className='flex items-center justify-between'>
            <p className='text-sm font-semibold'>Experience {index + 1}</p>
            {employment.workExperiences.length > 1 && (
              <button
                onClick={() => handleRemoveExperience(index)}
                className='text-xs font-medium text-red-500 hover:underline'
              >
                Remove
              </button>
            )}
          </div>

          <div>
            <label className='block text-sm'>Organization Name</label>
            <input
              type='text'
              value={exp.organization}
              onChange={(e) =>
                handleExperienceChange(index, 'organization', e.target.value)
              }
              placeholder='Organization Name'
              className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
            />
          </div>

          <div className='flex space-x-4'>
            <div className='flex-1'>
              <label className='block text-sm'>Position Held</label>
              <input
                type='text'
                value={exp.position}
                onChange={(e) =>
                  handleExperienceChange(index, 'position', e.target.value)
                }
                placeholder='Position'
                className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
              />
            </div>

            <div className='flex-1'>
              <label className='block text-sm'>Start Date</label>
              <input
                type='date'
                value={exp.startDate}
                onChange={(e) =>
                  handleExperienceChange(index, 'startDate', e.target.value)
                }
                className='bg-neutral2 mt-[12px] w-full rounded-[12px] border px-2 py-2'
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={handleAddExperience}
        className='text-mainGreen flex items-center font-medium hover:text-green-700'
      >
        <span className='bg-mainGreen mr-2 flex h-6 w-6 items-center justify-center rounded-full text-lg text-white'>
          +
        </span>
        Add Another Experience
      </button>
    </div>
  )
}

export default EmploymentHistory
