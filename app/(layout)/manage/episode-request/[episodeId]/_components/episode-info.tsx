import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

type Props = {
  title: string
  startDate: string
  endDate: string
  thumbnailUrl: string
  currentEpisodeCount: number
  totalEpisodeCount: number
  description: string
  categories: string[]
}

export const EpisodeInfo = ({
  title,
  startDate,
  endDate,
  thumbnailUrl,
  currentEpisodeCount,
  totalEpisodeCount,
  description,
  categories,
}: Props) => {
  return (
    <div className='flex gap-x-10 md:flex-row flex-col'>
      <div className='relative aspect-[4/5] min-h-[500px]'>
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          sizes=''
          className='object-cover rounded-md border border-black'
        />
      </div>
      <div className='mt-5'>
        <h1 className='text-4xl font-bold'>{title}</h1>
        <div className='text-xl mt-6 space-y-4'>
          <div>방영일: {startDate}</div>
          <div>종영일: {endDate}</div>
          <div>현재 에피소드: {currentEpisodeCount}화</div>
          <div>총 에피소드: {totalEpisodeCount}화</div>
          <div>
            <span>설명</span>
            <p className='text-base'>{description}</p>
          </div>
          <div>
            카테고리
            <div className='mt-2 flex gap-x-2 flex-wrap gap-y-2'>
              {categories.map((category, index) => (
                <Badge key={index} size={'lg'}>
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
