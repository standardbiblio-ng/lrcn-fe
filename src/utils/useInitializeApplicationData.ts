import { useEffect } from 'react'
// import unified GET hook
import { useGetMyApplication } from '@/api/hooks/useGetData'
import { useAcademicHistoryStore } from '@/stores/academic-history-store'
import { useStepperStore } from '@/stores/application-stepper-store'
import { useAttestationStore } from '@/stores/attestation-store'
// import all form stores
import { useBioDataStore } from '@/stores/bio-data-store'
import { useEmploymentHistoryStore } from '@/stores/employment-history-store'
import { useRecommendationStore } from '@/stores/recommendation-store'
import { useUploadDocumentStore } from '@/stores/upload-store'

interface FormItem<T = any> {
  data?: T
  set: (data: T) => void
  mark: () => void
  step: number
}

export function useInitializeApplicationData() {
  

  const { markComplete, next } = useStepperStore()
  //   const forms: FormItem[] = []

    const { setApplicationStatus } = useBioDataStore()

  // all form stores
  const { setFormData: setBioData, markInitialized: markBioInit } =
    useBioDataStore()
  const { setFormData: setAcademicData, markInitialized: markAcadInit } =
    useAcademicHistoryStore()
  const { setFormData: setEmploymentData, markInitialized: markEmpInit } =
    useEmploymentHistoryStore()
  const { setFormData: setRecommendationData, markInitialized: markRecInit } =
    useRecommendationStore()
  const { setFormData: setUploadData, markInitialized: markUploadInit } =
    useUploadDocumentStore()
  const { setFormData: setAttestationData, markInitialized: markAttInit } =
    useAttestationStore()
  //   const { setFormData: setPaymentData, markInitialized: markPayInit } = usePaymentStore()

  // Single query for entire application
  const { data: application } = useGetMyApplication()
  

  // Extract data from unified response
  const bio = application?.bioData
  const academic = application?.academicHistory
  const employment = application?.employmentHistory
  const rec = application?.recommendations
  const upload = application?.documents
  const attest = application?.attestation

  useEffect(() => {
    if (!application) return
    
    if (application.status) {
  setApplicationStatus(application.status) // Draft, Completed, Submitted
}
    const forms: FormItem[] = []

    if (bio) {
      forms.push({ data: bio, set: setBioData, mark: markBioInit, step: 2 })
    }

     
    if (academic?.length > 0) {
      const formattedData = {
        items: academic.map((record: any) => ({
          ...record,
          startDate: record.startDate?.split('T')[0] || '',
          endDate: record.endDate?.split('T')[0] || '',
        })),
      }
      forms.push({
        data: formattedData,
        set: setAcademicData,
        mark: markAcadInit,
        step: 3,
      })
    }

    if (employment?.length > 0) {
      const emp = employment[0]
      const formattedData = {
        employer: emp.employer || '',
        address: emp.address || '',
        status: emp.status || '',
        startDate: emp.startDate?.split('T')[0] || '',
        workExperience:
          emp.workExperience?.map((exp: any) => ({
            organisation: exp.organisation || '',
            positionHeld: exp.positionHeld || '',
            startDate: exp.startDate?.split('T')[0] || '',
          })) || [],
      }
      forms.push({
        data: formattedData,
        set: setEmploymentData,
        mark: markEmpInit,
        step: 4,
      })
    }

    if (rec?.length > 0) {
      forms.push({
        data: rec[0],
        set: setRecommendationData,
        mark: markRecInit,
        step: 5,
      })
    }

    if (upload?.length > 0) {
      const formattedData = {
        items: upload.map((doc: any) => ({
          name: doc.name || '',
          fileKey: doc.fileKey || '',
          fileType: doc.fileType || '',
          uploadedAt: doc.uploadedAt?.split('T')[0] || '',
        })),
      }
      forms.push({
        data: formattedData,
        set: setUploadData,
        mark: markUploadInit,
        step: 6,
      })
    }

    if (attest) {
      forms.push({
        data: attest,
        set: setAttestationData,
        mark: markAttInit,
        step: 7, // ✅ FIXED
      })
    }
     
    // Run all updates
    let anyFormProcessed = false
    forms.forEach((form) => {
      if (form.data) {
        form.set(form.data)
        form.mark()
        markComplete(form.step)
        anyFormProcessed = true
      }
    })
    if (anyFormProcessed) {
      next()
    }
  }, [
    application,
    bio,
    academic,
    employment,
    rec,
    upload,
    attest,
    markComplete,
    next,
    setBioData,
    setAcademicData,
    setEmploymentData,
    setRecommendationData,
    setUploadData,
    setAttestationData,
    markBioInit,
    markAcadInit,
    markEmpInit,
    markRecInit,
    markUploadInit,
    markAttInit,
    
    
  ])
}
