import { useGetMyApplication } from "@/api/hooks/useGetData";

export function useApplicationLock() {
   const {data: application, isLoading} = useGetMyApplication()

   return {
      isLocked: application?.status?.toLowerCase() === 'submitted',
      isLoading
   }
}
   