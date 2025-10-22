import { Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import applyImg from '@/assets/images/Group.png'
import cloud from '@/assets/images/dashboard-cloud.png'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'

export function Dashboard() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        {/* <TopNav links={topNav} /> */}
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid-cols-1 gap-4 lg:grid lg:grid-cols-3'>
              <Card className='flex flex-row justify-between bg-linear-to-r from-[#00A76F33] to-[#2C5F94C4] px-6 lg:col-span-4'>
                <div className='flex flex-col justify-center px-10'>
                  <div>
                    <h1 className='text-2xl font-bold text-[#004B50]'>
                      Hi, John Doe
                    </h1>
                  </div>
                  <div>
                    <p className='text-muted-foreground lg:text[13.08px] text-[11.28px]'>
                      Welcome to the LCRN Dashboard! Your hub for community
                      insights and progress tracking
                    </p>
                  </div>
                </div>
                <CardContent className='self-center ps-2'>
                  <img
                    src={cloud}
                    alt='Logo'
                    height='247'
                    // className={cn(className)}
                    width='200'
                  />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-1'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
                    <div className='h-[18px] w-[3px] rounded-tr-[4px] rounded-br-[4px] bg-[#FF4343]'></div>
                    Your Application
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex justify-center'>
                  <div className='flex flex-col items-center gap-4'>
                    <img
                      src={applyImg}
                      alt='Application illustration'
                      height='60'
                      width='60'
                      className='flex-shrink-0'
                    />

                    <div className='justifycenter flex flex-col items-center space-y-2'>
                      <p className='text-muted-foreground text-sm'>
                        Take the first step to join LCRN
                      </p>
                      <Link to='/application'>
                        <button className='rounded-lg bg-[#2C5F94] px-4 py-2 text-sm font-medium text-white hover:bg-[#2C5F94]/90'>
                          Start here
                        </button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className='col-span-1 col-end-6 pt-0 lg:col-start-1'>
                <CardHeader className='px-0 pt-2'>
                  <CardTitle className='border-b-active rounded-[10px] border-2 border-x-white border-t-white px-[22px] py-[10px] text-[#2C5F94]'>
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex justify-center px-[11px] py-[25px]'>
                    <p className='text-active text-[20px]'>No Messages</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
