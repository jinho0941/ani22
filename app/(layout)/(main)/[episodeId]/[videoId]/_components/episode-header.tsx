type Props = {
  title: string
}
export const EpisodeHeader = ({ title }: Props) => {
  return (
    <header className='mt-2 lg:p-5 p-2'>
      <h1 className='lg:text-3xl text-lg line-clamp-1'>{title}</h1>
    </header>
  )
}
