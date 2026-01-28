import React from 'react'
import { format } from 'date-fns'
import { type EmploymentHistoryItem } from '@/schemas/application'
import logo from '@/assets/images/LOGO.png'
import { useGetMyApplication } from '@/api/hooks/useGetData'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type ApplicationDetailsProps = {
  isOpen: boolean
  onClose: () => void
}

const ApplicationDetails = ({ isOpen, onClose }: ApplicationDetailsProps) => {
  const { data: application } = useGetMyApplication()

  // Extract data for each form
  const bioData = application?.bioData
  const academicHistory = application?.academicHistory
  const employmentHistory = application?.employmentHistory
  const recommendations = application?.recommendations
  const documents = application?.documents

  const getFilenameFromKey = (fileKey: string): string => {
    if (!fileKey) return 'No file'
    const parts = fileKey.split('/')
    return parts.length > 1 ? parts[parts.length - 1] : fileKey
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
          <DialogDescription>Review your application.</DialogDescription>
        </DialogHeader>
        {/* === HEADER SECTION === */}
        <div className='text-center'>
          <img
            src={logo}
            alt='Nigeria coat'
            className='mx-auto mb-4 h-24 w-24'
          />
          <h2 className='font-montserrat mb-1 text-2xl font-bold'>
            LIBRARIANS' REGISTRATION COUNCIL OF NIGERIA (LRCN)
          </h2>
          {/* <p>Veterinary Council of Nigeria Building,</p> */}
          <p>
            LRCN, 2nd Floor, Stephen Oronsaya Building, Dusten Alhaj along Kubwa
            Road, Abuja.
          </p>
          <p>Tel: +234 (666) 888 0000 | Email: lrcn.gov@gmail.com</p>
          <p>Website: www.lrcn.gov.ng</p>
        </div>

        {/* === BIO DATA === */}
        <section className='rounded-xl border p-4 shadow-sm'>
          <h3 className='text-mainGreen mb-3 text-lg font-semibold'>
            Bio Data Information
          </h3>
          <table className='w-full border-collapse text-left'>
            <tbody>
              <tr className='border-b'>
                <td className='font-medium'>Last Name</td>
                <td className='capitalize'>{bioData?.lastName}</td>
              </tr>
              {bioData?.otherNames && (
                <tr className='border-b'>
                  <td className='font-medium'>Other Name</td>
                  <td className='capitalize'>{bioData?.otherNames}</td>
                </tr>
              )}

              {bioData?.previousNames && (
                <tr className='border-b'>
                  <td className='font-medium'>Previous Name</td>
                  <td className='capitalize'>{bioData?.previousNames}</td>
                </tr>
              )}

              <tr className='border-b'>
                <td className='font-medium'>Email</td>
                <td>{bioData?.email}</td>
              </tr>

              <tr className='border-b'>
                <td className='font-medium'>Phone Number</td>
                <td>{bioData?.phoneNumber}</td>
              </tr>

              <tr className='border-b'>
                <td className='font-medium'>Nationality</td>
                <td>{bioData?.nationality}</td>
              </tr>

              <tr className='border-b'>
                <td className='font-medium'>State of Origin</td>
                <td>{bioData?.state}</td>
              </tr>

              <tr className='border-b'>
                <td className='font-medium'>Local Government Area</td>
                <td>{bioData?.lga}</td>
              </tr>

              <tr className='border-b'>
                <td className='font-medium'>Date of Birth</td>
                <td>
                  {bioData?.dob
                    ? format(new Date(bioData.dob), 'yyyy-MM-dd')
                    : 'N/A'}
                </td>
              </tr>
              <tr>
                <td className='font-medium'>Gender</td>
                <td>{bioData?.gender}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* === ACADEMIC HISTORY === */}
        <section className='rounded-xl border p-4 shadow-sm'>
          <h3 className='text-mainGreen mb-3 text-lg font-semibold'>
            Academic History
          </h3>
          <table className='w-full border-collapse text-left'>
            <tbody>
              {academicHistory?.map((item: any, index: number) => (
                <React.Fragment key={index}>
                  <tr className='border-b'>
                    <td className='w-1/2 font-medium'>Institution</td>
                    <td className='capitalize'>{item.institution}</td>
                  </tr>
                  <tr className='border-b'>
                    <td className='font-medium'>Qualification</td>
                    <td>{item.qualification}</td>
                  </tr>
                  <tr className='border-b'>
                    <td className='font-medium'>Start – End Date</td>
                    <td>
                      {item.startDate?.split('T')[0] +
                        ' – ' +
                        item.endDate?.split('T')[0]}
                    </td>
                  </tr>

                  {/* Add spacing between records */}
                  {index < academicHistory.length - 1 && (
                    <tr>
                      <td colSpan={2}>
                        <div className='my-3 border-b border-dashed border-gray-300'></div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </section>

        {/* === EMPLOYMENT HISTORY === */}
        <section className='rounded-xl border p-4 shadow-sm'>
          <h3 className='text-mainGreen mb-3 text-lg font-semibold'>
            Employment History
          </h3>
          <table className='w-full border-collapse text-left'>
            <tbody>
              {employmentHistory?.map(
                (each: EmploymentHistoryItem, index: number) => (
                  <React.Fragment key={index}>
                    <tr className='border-b'>
                      <td className='w-1/2 font-medium'>Organisation</td>
                      <td className='capitalize'>{each?.organisation}</td>
                    </tr>
                    <tr className='border-b'>
                      <td className='font-medium'>Position Held</td>
                      <td className='capitalize'>{each?.positionHeld}</td>
                    </tr>
                    <tr className='border-b'>
                      <td className='font-medium'>Address</td>
                      <td className='capitalize'>{each?.address}</td>
                    </tr>
                    <tr className='border-b'>
                      <td className='font-medium'>Status</td>
                      <td>{each?.status}</td>
                    </tr>
                    <tr className='border-b'>
                      <td className='font-medium'>Start Date</td>
                      <td>
                        {each?.startDate
                          ? format(new Date(each.startDate), 'yyyy-MM-dd')
                          : 'N/A'}
                      </td>
                    </tr>

                    {/* Add spacing between records */}
                    {index < employmentHistory.length - 1 && (
                      <tr>
                        <td colSpan={2}>
                          <div className='my-3 border-b border-dashed border-gray-300'></div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              )}
            </tbody>
          </table>
        </section>

        {/* === RECOMMENDATIONS === */}
        <section className='rounded-xl border p-4 shadow-sm'>
          <h3 className='text-mainGreen mb-3 text-lg font-semibold'>
            Referees
          </h3>
          <table className='w-full border-collapse text-left'>
            <tbody>
              {recommendations?.map((referee: any, index: number) => (
                <React.Fragment key={index}>
                  <tr className='border-b'>
                    <td className='w-1/2 font-medium'>Name</td>
                    <td className='capitalize'>{referee.name}</td>
                  </tr>
                  <tr className='border-b'>
                    <td className='font-medium'>Email</td>
                    <td>{referee.email}</td>
                  </tr>
                  <tr>
                    <td className='font-medium'>Phone</td>
                    <td>{referee.phoneNumber}</td>
                  </tr>

                  {/* Add spacing between records */}
                  {index < recommendations.length - 1 && (
                    <tr>
                      <td colSpan={2}>
                        <div className='my-3 border-b border-dashed border-gray-300'></div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </section>

        {/* === DOCUMENT UPLOADS === */}
        <section className='rounded-xl border p-4 shadow-sm'>
          <h3 className='text-mainGreen mb-3 text-lg font-semibold'>
            Document Uploads
          </h3>
          <table className='w-full border-collapse text-left'>
            <tbody>
              {documents?.map((item: any, index: number) => (
                <React.Fragment key={index}>
                  <tr className='border-b'>
                    <td className='w-1/2 font-medium'>Document Type</td>
                    <td>{item.name}</td>
                  </tr>
                  <tr>
                    <td className='font-medium'>File Name</td>
                    <td className='break-all'>
                      {getFilenameFromKey(item.fileKey)}
                    </td>
                  </tr>

                  {/* Add spacing between records */}
                  {index < documents.length - 1 && (
                    <tr>
                      <td colSpan={2}>
                        <div className='my-3 border-b border-dashed border-gray-300'></div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </section>
      </DialogContent>
    </Dialog>
  )
}

export default ApplicationDetails
