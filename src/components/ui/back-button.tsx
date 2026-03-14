'use client'

import { useRouter } from 'next/navigation'
import { Button } from './button'
import { ChevronLeft } from 'lucide-react'

export function BackButton() {
  const router = useRouter()
  return (
    <Button 
      variant="ghost" 
      className="mb-6 -ml-3 pl-2 pr-4 text-muted-foreground hover:text-foreground" 
      onClick={() => router.back()}
    >
      <ChevronLeft className="w-4 h-4 mr-1" />
      Kembali
    </Button>
  )
}
