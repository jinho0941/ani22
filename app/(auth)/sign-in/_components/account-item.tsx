'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

type Props = {
  label: string
  value: string
}

export const AccountItem = ({ label, value }: Props) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {}
  }

  return (
    <div className='flex items-center gap-x-2'>
      <span
        className={`${
          label === 'password' ? 'text-indigo-500' : 'text-sky-500'
        }`}
      >
        {label}:
      </span>
      <span className='font-bold ml-1'>{value}</span>
      <button
        onClick={handleCopy}
        className='p-1 rounded-md transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700'
        aria-label={`Copy ${label}`}
      >
        {isCopied ? (
          <Check className='h-4 w-4 text-green-500' />
        ) : (
          <Copy className='h-4 w-4' />
        )}
      </button>
    </div>
  )
}
