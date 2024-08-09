type Props = {
  title: string
}

export const VideoHeader = ({ title }: Props) => {
  return (
    <section className='break-all'>
      <h1 className='lg:text-3xl text-lg font-bold'>{title}</h1>
    </section>
  )
}
