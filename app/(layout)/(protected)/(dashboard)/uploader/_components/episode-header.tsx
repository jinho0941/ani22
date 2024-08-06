'use client'

import { useEpisodeHeader } from '@/app/hooks/use-episode-header'
import { Combobox } from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'

const options = [
  { label: '최근순', value: 'new' },
  { label: '오래된순', value: 'past' },
]

export const EpisodeHeader = () => {
  const { option, setOption, searchTerm, setSearchTerm, onSelected } =
    useEpisodeHeader()

  return (
    <section>
      <div className='flex items-center gap-x-2'>
        <h2 className='text-xl font-bold'>내가 올린 에피소드들</h2>
        <Combobox
          list={options}
          value={option}
          setValue={setOption}
          onSelected={onSelected}
        />
      </div>
      <div className='mt-4'>
        <Input
          placeholder='검색하여 찾기'
          className='max-w-2xl'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </section>
  )
}
