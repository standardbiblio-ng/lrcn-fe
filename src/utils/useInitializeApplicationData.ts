import { useEffect } from 'react'
// import all GET hooks
import {
  useGetAcademicHistory,
  useGetAttestation,
  useGetBioData,
  useGetEmploymentHistory,
  useGetRecommendation,
  useGetUploadDocuments,
} from '@/api/hooks/useGetData'
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

  // queries
  const { data: bio } = useGetBioData()
  const { data: academic } = useGetAcademicHistory()
  const { data: employment } = useGetEmploymentHistory()
  const { data: rec } = useGetRecommendation()
  const { data: upload } = useGetUploadDocuments()
  const { data: attest } = useGetAttestation()
  console.log('Fetched bio application data: ', bio)
  console.log('Fetched academic application data: ', academic)
  console.log('Fetched employment application data: ', employment)
  console.log('Fetched recommendation application data: ', rec)
  console.log('Fetched upload application data: ', upload)
  console.log('Fetched attestation application data: ', attest)

  useEffect(() => {
    // console.log('Initialize Application Data........')
    const forms: FormItem[] = []

    if (bio) {
      forms.push({ data: bio, set: setBioData, mark: markBioInit, step: 2 })
    }

    if (academic?.length > 0) {
      // console.log('Formatting academic data: ', academic)
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
        documents: upload.map((doc: any) => ({
          name: doc.name || '',
          fileUrl: doc.fileUrl || '',
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
      // console.log('Attestation data found: ', attest)
      forms.push({
        data: attest,
        set: setAttestationData,
        mark: markAttInit,
        step: 7, // ✅ FIXED
      })
    }
    // console.log('forms: ', forms)
    // Run all updates
    let anyFormProcessed = false
    forms.forEach((form) => {
      if (form.data) {
        // console.log('Initializing data for form: ', form.data)
        form.set(form.data)
        form.mark()
        markComplete(form.step)
        anyFormProcessed = true
      }
    })
    if (anyFormProcessed) {
      next()
    }
    // console.log('Application Data Initialized.')
  }, [
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
