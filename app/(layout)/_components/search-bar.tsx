import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export const SearchBar = () => {
  return (
    <div className='flex justify-center relative w-full'>
      <Search className='absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer' />
      <Input className='pr-12' placeholder='보고싶은 작품을 검색하세요.' />
    </div>
  )
}
