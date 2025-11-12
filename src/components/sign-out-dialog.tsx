import { useLocation, useNavigate } from 'react-router-dom'
import { useAcademicHistoryStore } from '@/stores/academic-history-store'
import { useStepperStore } from '@/stores/application-stepper-store'
import { useAttestationStore } from '@/stores/attestation-store'
import { useAuthStore } from '@/stores/auth-store'
import { useBioDataStore } from '@/stores/bio-data-store'
import { useEmploymentHistoryStore } from '@/stores/employment-history-store'
import { useRecommendationStore } from '@/stores/recommendation-store'
import { useUploadDocumentStore } from '@/stores/upload-store'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { auth } = useAuthStore()
  const { reset: resetBioData } = useBioDataStore()
  const { reset: resetAcademicData } = useAcademicHistoryStore()
  const { reset: resetEmploymentData } = useEmploymentHistoryStore()
  const { reset: resetRecommendationData } = useRecommendationStore()
  const { reset: resetUploadData } = useUploadDocumentStore()
  const { reset: resetAttestationData } = useAttestationStore()

  const handleSignOut = () => {
    auth.reset()
    auth.resetAccessToken()

    // ✅ Clear persisted storage for all stores
    resetBioData()
    resetAcademicData()
    resetEmploymentData()
    resetRecommendationData()
    resetUploadData()
    resetAttestationData()

    // Preserve current location for redirect after sign-in
    const currentPath = location.pathname + location.search
    navigate('/sign-in', {
      state: { redirect: currentPath },
      replace: true,
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Sign out'
      desc='Are you sure you want to sign out? You will need to sign in again to access your account.'
      confirmText='Sign out'
      handleConfirm={handleSignOut}
      className='sm:max-w-sm'
    />
  )
}
