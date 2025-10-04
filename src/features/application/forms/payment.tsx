import React, { useState } from 'react'

function Payment() {
  const [selectedMethod, setSelectedMethod] = useState('')
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const [receiptName, setReceiptName] = useState<string>('')

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptName(file.name)
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = () => setReceiptPreview(reader.result as string)
        reader.readAsDataURL(file)
      } else {
        // For non-images like PDFs
        setReceiptPreview(null)
      }
    }
  }

  const removeReceipt = () => {
    setReceiptPreview(null)
    setReceiptName('')
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>Payment</h2>
      <h4 className='font-montserrat text-md text-active font-normal'>
        An Applicant is required to pay a non-refundable processing fee.
      </h4>

      <p>Choose any of the following payment methods:</p>
      <ul className='space-y-2 pl-5'>
        {/* Bank Transfer */}
        <li>
          <input
            type='radio'
            id='bank-transfer'
            name='payment-method'
            value='bank-transfer'
            checked={selectedMethod === 'bank-transfer'}
            onChange={(e) => setSelectedMethod(e.target.value)}
          />
          <label htmlFor='bank-transfer' className='ml-2 cursor-pointer'>
            Bank Transfer
          </label>

          {selectedMethod === 'bank-transfer' && (
            <div className='mt-3 space-y-2 rounded border bg-gray-50 p-4'>
              <p>
                To proceed with your application fee payment via{' '}
                <strong>Bank Transfer</strong>, please follow these steps:
              </p>
              <ol className='list-decimal space-y-1 pl-5'>
                <li>
                  Send the money to the following account:
                  <ul className='list-disc pl-5'>
                    <li>Account Name: Your Name</li>
                    <li>Account Number: 123456789</li>
                    <li>Bank Name: Your Bank</li>
                    <li>Reference: Your Application ID</li>
                  </ul>
                </li>
                <li>Download or save the transfer receipt/slip</li>
                <li>
                  Ensure recipient details match our official account details
                </li>
                <li>
                  Add a <strong>payment reference/narration</strong> in the
                  transfer description
                </li>
                <li>
                  Upload a <strong>clear and readable</strong> picture of your
                  receipt/slip
                </li>
              </ol>

              {/* Upload + Preview */}
              <div className='mt-3'>
                <label className='mb-2 block text-sm'>
                  Upload receipt/slip
                </label>
                <div
                  className={`bg-neutral2 relative flex h-[200px] w-full items-center justify-center overflow-hidden rounded-[12px] border`}
                  style={{
                    backgroundImage: receiptPreview
                      ? `url(${receiptPreview})`
                      : 'none',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                >
                  {!receiptPreview && !receiptName && (
                    <span className='text-sm text-gray-500'>
                      Click to upload receipt
                    </span>
                  )}
                  <input
                    type='file'
                    accept='image/*,.pdf'
                    onChange={handleReceiptChange}
                    className='absolute inset-0 cursor-pointer opacity-0'
                  />
                  {(receiptPreview || receiptName) && (
                    <button
                      type='button'
                      onClick={removeReceipt}
                      className='absolute top-2 right-2 rounded-md bg-black/50 px-2 py-1 text-xs text-white'
                    >
                      Remove
                    </button>
                  )}
                  {/* For non-image files */}
                  {!receiptPreview && receiptName && (
                    <div className='text-center text-sm text-gray-700'>
                      <p>{receiptName}</p>
                      <p className='text-xs text-gray-500'>
                        (Preview not available)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </li>

        {/* Credit Card */}
        <li>
          <input
            type='radio'
            id='credit-card'
            name='payment-method'
            value='credit-card'
            checked={selectedMethod === 'credit-card'}
            onChange={(e) => setSelectedMethod(e.target.value)}
          />
          <label htmlFor='credit-card' className='ml-2 cursor-pointer'>
            Credit Card
          </label>

          {selectedMethod === 'credit-card' && (
            <div className='mt-3 space-y-2 rounded border bg-gray-50 p-4'>
              <p>
                To proceed with your application fee payment via{' '}
                <strong>Credit Card</strong>, please follow these steps:
              </p>
              <ol className='list-decimal space-y-1 pl-5'>
                <li>Ensure you have a valid credit card</li>
                <li>Enter your credit card details accurately</li>
                <li>
                  Confirm that your billing address matches the one with your
                  bank
                </li>
                <li>Complete the payment form and submit</li>
              </ol>
            </div>
          )}
        </li>

        {/* Cash */}
        <li>
          <input
            type='radio'
            id='cash'
            name='payment-method'
            value='cash'
            checked={selectedMethod === 'cash'}
            onChange={(e) => setSelectedMethod(e.target.value)}
          />
          <label htmlFor='cash' className='ml-2 cursor-pointer'>
            Cash
          </label>

          {selectedMethod === 'cash' && (
            <div className='mt-3 space-y-2 rounded border bg-gray-50 p-4'>
              <p>
                To proceed with your application fee payment via{' '}
                <strong>Cash</strong>, please follow these steps:
              </p>
              <ol className='list-decimal space-y-1 pl-5'>
                <li>
                  Visit the nearest payment center:
                  <ul className='list-disc pl-5'>
                    <li>National Library of Nigeria and State Branches</li>
                    <li>All State Libraries</li>
                    <li>All University Libraries</li>
                    <li>All Polytechnic Libraries</li>
                    <li>All Colleges of Education Libraries</li>
                    <li>Chairman of each state chapter of NLA</li>
                  </ul>
                </li>
                <li>Provide your application details to the cashier</li>
                <li>Make the cash payment and request a receipt</li>
              </ol>
            </div>
          )}
        </li>
      </ul>
    </div>
  )
}

export default Payment
