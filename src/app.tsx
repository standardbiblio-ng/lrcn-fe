import { RouterProvider } from 'react-router-dom'
// import { router } from './__routes'
import Providers from './providers'
import { router } from './routes'

export default function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}

// App.tsx - Minimal version to isolate the error
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import Providers from './providers'
// import { router } from './routes'

// // Minimal component to test
// function TestComponent() {
//   return (
//     <div>
//       <h1>Test Page</h1>
//       <p className='text-xl font-medium text-red-500'>Simple content</p>
//     </div>
//   )
// }

// // Minimal router for testing
// const testRouter = createBrowserRouter([
//   {
//     path: '/',
//     element: <TestComponent />,
//   },
// ])

// export default function App() {
//   return (
//     <Providers>
//       <RouterProvider router={testRouter} />
//     </Providers>
//   )
// }
