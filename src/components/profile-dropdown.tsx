import { useGetUserProfile } from '@/api/hooks/useGetData'
import { useAuthStore } from '@/stores/auth-store'
import { useBioDataStore } from '@/stores/bio-data-store'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOutDialog } from '@/components/sign-out-dialog'

export function ProfileDropdown() {
  const [open, setOpen] = useDialogState()

  const { formData: bioData } = useBioDataStore()
  const { auth } = useAuthStore()
  const user = auth.user
  const { data: profile } = useGetUserProfile()

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <Avatar className='h-8 w-8'>
              <AvatarImage
                src={profile?.profilePicture ?? ''}
                alt={user?.email ?? 'User avatar'}
              />
              <AvatarFallback>
                {bioData?.otherNames
                  ? bioData?.otherNames?.charAt(0).toUpperCase() +
                    bioData?.lastName?.charAt(0).toUpperCase()
                  : user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-1.5'>
              {bioData?.otherNames && (
                <p className='text-sm leading-none font-medium'>
                  {bioData?.otherNames}
                </p>
              )}
              <p className='text-muted-foreground text-xs leading-none'>
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Sign out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
