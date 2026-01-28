import { useState } from 'react'
import { useGetUserProfile } from '@/api/hooks/useGetData'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import ApplicationDetails from './applicationDetails'

const Member = () => {
  const { data: profile } = useGetUserProfile()
  const [open, setOpen] = useState(false)

  const makePayment = () => {
    // console.log('Make payment')
  }

  const viewApplicationDetails = () => {
    setOpen(true)
  }

  const hasRegNo = Boolean(profile?.regNo)
  const status = profile?.membershipStatus

  // ===== Derived UI values =====

  const regNoText = hasRegNo ? profile.regNo : 'Awaiting'

  const statusText =
    status === 'active'
      ? 'Active'
      : status === 'inactive'
        ? 'Inactive'
        : 'Awaiting Induction'

  const renderAction = () => {
    if (hasRegNo && status === 'active') {
      return <Button onClick={viewApplicationDetails}>View</Button>
    }

    if (hasRegNo && status === 'inactive') {
      return <Button onClick={makePayment}>Renew</Button>
    }

    if (!hasRegNo && status !== 'active') {
      return <Button onClick={makePayment}>Pay Induction Fee</Button>
    }

    return '—'
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <ApplicationDetails isOpen={open} onClose={() => setOpen(false)} />

      <Main fixed className='mx-80'>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Membership
          </h1>
          <p className='text-muted-foreground'>
            Keep track of your membership details here.
          </p>
        </div>

        <Separator className='my-4 lg:my-6' />

        <div className='flex w-full flex-1 overflow-y-hidden p-1'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>LRCN Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow>
                <TableCell>
                  {!profile?.otherNames && !profile?.lastName
                    ? 'Name not set'
                    : `${profile.otherNames} ${profile.lastName}`}
                </TableCell>

                <TableCell>{regNoText}</TableCell>

                <TableCell className='capitalize'>{statusText}</TableCell>

                <TableCell>{renderAction()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Main>
    </>
  )
}

export default Member
