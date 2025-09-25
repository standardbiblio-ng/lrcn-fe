import { lazy, Suspense } from 'react'

export const LazyPage = (
  factory: () => Promise<any>,
  exportName: string = 'default'
) => {
  const LazyComponent = lazy(async () => {
    const module = await factory()

    // Handle named exports (like export const Component)
    if (exportName !== 'default' && exportName in module) {
      return { default: module[exportName] }
    }

    // Handle default exports (like export default Component)
    if ('default' in module) {
      return module
    }

    // If no default export, assume the module itself is the component
    return { default: module }
  })

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  )
}
