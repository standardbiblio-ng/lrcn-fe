import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  //   title: React.ReactNode
  disabled?: boolean
  //   desc: React.JSX.Element | string
  cancelBtnText?: string
  //   confirmText?: React.ReactNode
  destructive?: boolean
  //   handleConfirm: () => void
  isLoading?: boolean
  className?: string
  children?: React.ReactNode
}

export function ConfirmApplicationDialog(props: ConfirmDialogProps) {
  const {
    children,
    className,
    cancelBtnText,
    destructive,
    isLoading,
    disabled = false,
    ...actions
  } = props

  const navigate = useNavigate()
  const targetPath = '/'

  const handleConfirm = () => {
    navigate(targetPath, { replace: true })
  }

  return (
    <AlertDialog {...actions}>
      <AlertDialogContent className={cn(className && className)}>
        <AlertDialogHeader className='text-start'>
          <AlertDialogDescription asChild>
            <div>Your application has been successfully submited.</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <Button
            variant={destructive ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={disabled || isLoading}
          >
            {'Okay'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
