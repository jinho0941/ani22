import { FaStar } from 'react-icons/fa'

type Props = {
  views: number
  monthsAgo: string
  rating: string
  description: string
}

export const VideoDescription = ({
  views,
  monthsAgo,
  rating,
  description,
}: Props) => (
  <section className='mt-4 dark:bg-slate-900 bg-slate-200 p-4 rounded-md'>
    <div className='flex gap-x-3 items-center font-semibold lg:text-lg'>
      <span>조회수 {views}회</span>
      <span className='text-sm text-muted-foreground'>{monthsAgo}</span>
      <div className='flex items-center gap-x-1'>
        <FaStar className='text-yellow-500' />
        <span className='font-bold'>{rating}</span>
      </div>
    </div>
    <div className='mt-2'>
      <h2 className='font-semibold'>설명</h2>
      <p className='mt-1 line-clamp-2'>{description}</p>
    </div>
  </section>
)
