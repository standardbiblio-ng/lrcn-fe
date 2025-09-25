import { type SVGProps } from 'react'
import { cn } from '@/lib/utils'

export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <img
      src={'./images/LOGO.png'}
      alt='Logo'
      height='24'
      className={cn('size-6', className)}
      width='24'
    />
  )
}
