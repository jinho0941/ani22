import { Search } from 'lucide-react'

type NoResultsProps = {
  searchTerm: string
}

export const NoResults = ({ searchTerm }: NoResultsProps) => {
  return (
    <div className='flex flex-col items-center mt-12 text-center space-y-4 w-screen'>
      <Search className='w-12 h-12 text-gray-500 dark:text-gray-400' />
      <p className='text-lg font-semibold text-gray-700 dark:text-gray-300'>
        해당 검색 결과를 찾지 못하였습니다. "
        <span className='text-sky-500'>{searchTerm}</span>"
      </p>
      <p className='text-gray-600 dark:text-gray-400'>
        다른 키워드로 검색을 해주세요.
      </p>
    </div>
  )
}
