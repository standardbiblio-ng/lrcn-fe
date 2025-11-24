import { type SVGProps } from 'react'
import logoImage from '@/assets/images/LOGO.png'
import { cn } from '@/lib/utils'

export function Logo({ className }: SVGProps<SVGSVGElement>) {
  return (
    <img
      src={logoImage}
      alt='Logo'
      height='80'
      className={cn(className)}
      width='80'
    />
  )
}
