import { AvatarImage } from '@radix-ui/react-avatar'
import { ChevronsUpDown, LogOut } from 'lucide-react'
import { useGetUserProfile } from '@/api/hooks/useGetData'
import { useAuthStore } from '@/stores/auth-store'
import { useBioDataStore } from '@/stores/bio-data-store'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { SignOutDialog } from '@/components/sign-out-dialog'

export function NavUser() {
  const { isMobile } = useSidebar()
  const [open, setOpen] = useDialogState()
  const { formData: bioData } = useBioDataStore()
  const { data: profile } = useGetUserProfile()
  const { auth } = useAuthStore()
  const user = auth.user

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage src={profile.profilePicture ?? ''} />
                  <AvatarFallback className='rounded-lg'>
                    {bioData?.otherNames
                      ? bioData?.otherNames?.charAt(0).toUpperCase() +
                        bioData?.lastName?.charAt(0).toUpperCase()
                      : user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-start text-sm leading-tight'>
                  {bioData?.otherNames && (
                    <span className='truncate font-semibold'>
                      {bioData?.otherNames}
                    </span>
                  )}

                  <span className='truncate text-xs'>{user?.email}</span>
                </div>
                <ChevronsUpDown className='ms-auto size-4' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
              side={isMobile ? 'bottom' : 'right'}
              align='end'
              sideOffset={4}
            >
              <DropdownMenuLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-1 py-1.5 text-start text-sm'>
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarFallback className='rounded-lg'>
                      {bioData?.otherNames
                        ? bioData?.otherNames?.charAt(0).toUpperCase() +
                          bioData?.lastName?.charAt(0).toUpperCase()
                        : user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-start text-sm leading-tight'>
                    {bioData?.otherNames && (
                      <span className='truncate font-semibold'>
                        {bioData?.otherNames}
                      </span>
                    )}
                    <span className='truncate text-xs'>{user?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOpen(true)}>
                <LogOut />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
