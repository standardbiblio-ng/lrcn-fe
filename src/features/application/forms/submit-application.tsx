function SubmitApplication() {
  return (
    <div className='space-y-4'>
      <h2 className='font-montserrat mb-1 text-xl font-semibold'>
        Application Submitted
      </h2>
      <div className='mt-8'>
        <p className='font-montserrat text-md text-active font-normal'>
          Please fill out all fields.
        </p>
        <p className='text-active text-sm font-semibold'>
          Your application has been submitted successfully
        </p>
        <p className='text-active text-sm font-semibold'>
          Please check your email in the next 24 hours while you await Approval
        </p>
      </div>
    </div>
  )
}

export default SubmitApplication
