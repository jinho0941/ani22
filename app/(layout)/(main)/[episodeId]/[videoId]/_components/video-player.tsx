type Props = {
  src: string
}

export const VideoPlayer = ({ src }: Props) => {
  return (
    <div className='lg:w-[1920px] aspect-video relative bg-black lg:rounded-lg'>
      <video
        src={src}
        controls
        className='absolute inset-0 w-full h-full lg:rounded-lg'
      />
    </div>
  )
}
