'use client'

import { useState } from 'react'

import { Combobox } from '@/components/ui/combobox'
import { useRouter } from 'next/navigation'

const sortOptions = [
  {
    value: '최신화',
    label: '최신화',
  },
  {
    value: '첫화',
    label: '첫화',
  },
]

type Props = {
  episodeId: string
}

export const VideoListHeader = ({ episodeId }: Props) => {
  const router = useRouter()
  const [option, setOption] = useState(sortOptions[0].value)

  const onSelected = (value: string) => {
    let query
    if (value === '최신화') query = new URLSearchParams({ order: 'new' })
    else query = new URLSearchParams({ order: 'past' })

    router.push(`/${episodeId}?${query}`)
  }

  return (
    <div className='flex justify-between items-center'>
      <h2 className='text-2xl font-bold'>에피소드</h2>
      <div className='flex items-center gap-x-1'>
        <span className='text-sm'>정렬 순서</span>
        <Combobox
          list={sortOptions}
          value={option}
          setValue={setOption}
          onSelected={onSelected}
        />
      </div>
    </div>
  )
}
