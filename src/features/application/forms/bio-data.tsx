function BioData() {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <header>
        <h2 className='font-montserrat mb-1 text-xl font-semibold text-gray-800'>
          Bio-Data
        </h2>
        <h4 className='font-montserrat text-md text-active font-normal'>
          Please fill out all fields.
        </h4>
      </header>

      {/* Names */}
      <div>
        <label
          htmlFor='first-name'
          className='block text-sm font-medium text-gray-700'
        >
          First Name
        </label>
        <input
          id='first-name'
          type='text'
          placeholder='Enter first name'
          className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
        />
      </div>

      <div>
        <label
          htmlFor='last-name'
          className='block text-sm font-medium text-gray-700'
        >
          Last Name
        </label>
        <input
          id='last-name'
          type='text'
          placeholder='Enter last name'
          className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
        />
      </div>

      <div>
        <label
          htmlFor='other-names'
          className='block text-sm font-medium text-gray-700'
        >
          Other Names
        </label>
        <input
          id='other-names'
          type='text'
          placeholder='Enter other names'
          className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
        />
      </div>

      <div>
        <label
          htmlFor='previous-names'
          className='block text-sm font-medium text-gray-700'
        >
          Previous Names (if name has changed) with Date
        </label>
        <input
          id='previous-names'
          type='text'
          placeholder='Enter previous names'
          className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
        />
      </div>

      {/* Contact Info */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700'
          >
            Email
          </label>
          <input
            id='email'
            type='email'
            placeholder='Enter your email'
            className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
          />
        </div>
        <div>
          <label
            htmlFor='phone'
            className='block text-sm font-medium text-gray-700'
          >
            Phone Number
          </label>
          <input
            id='phone'
            type='tel'
            placeholder='Enter your phone number'
            className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
          />
        </div>
      </div>

      {/* Nationality & State */}
      <div>
        <label
          htmlFor='nationality'
          className='block text-sm font-medium text-gray-700'
        >
          Nationality
        </label>
        <select
          id='nationality'
          className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
        >
          <option value='nigerian'>Nigerian</option>
          <option value='american'>American</option>
          <option value='british'>British</option>
        </select>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div>
          <label
            htmlFor='state'
            className='block text-sm font-medium text-gray-700'
          >
            State
          </label>
          <select
            id='state'
            className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
          >
            <option>Abia</option>
            <option>Adamawa</option>
            <option>Akwa Ibom</option>
            <option>Enugu</option>
            <option>FCT</option>
            <option>Imo</option>
            <option>Jigawa</option>
            <option>Kano</option>
            <option>Ogun</option>
            <option>Ondo</option>
            <option>Osun</option>
            <option>Yobe</option>
          </select>
        </div>

        <div>
          <label
            htmlFor='lga'
            className='block text-sm font-medium text-gray-700'
          >
            LGA
          </label>
          <select
            id='lga'
            className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
          >
            <option>Yola</option>
            <option>Jimeta</option>
          </select>
        </div>
      </div>

      {/* DOB & Gender */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div>
          <label
            htmlFor='dob'
            className='block text-sm font-medium text-gray-700'
          >
            Date of Birth
          </label>
          <input
            id='dob'
            type='date'
            className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
          />
        </div>

        <div>
          <label
            htmlFor='gender'
            className='block text-sm font-medium text-gray-700'
          >
            Gender
          </label>
          <select
            id='gender'
            className='bg-neutral2 mt-2 w-full rounded-[12px] border px-3 py-2'
          >
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default BioData
