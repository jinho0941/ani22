'use client'

import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'

import { updateVideoOrder } from '@/app/action/video'
import { VideoWithRequest } from '@/type'
import VideoItem from './video-item'

type Props = {
  initialVideos: VideoWithRequest[]
  episodeId: string
}

export const VideoList = ({ initialVideos, episodeId }: Props) => {
  const [videos, setVideos] = useState<VideoWithRequest[]>(initialVideos)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setVideos(initialVideos)
  }, [initialVideos])

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const originalVideos = Array.from(videos)

    const reorderedVideos = Array.from(videos)
    const [movedVideo] = reorderedVideos.splice(result.source.index, 1)
    reorderedVideos.splice(result.destination.index, 0, movedVideo)

    reorderedVideos.forEach((video, index) => {
      video.order = index + 1
    })

    setVideos(reorderedVideos)

    startTransition(async () => {
      const action = await updateVideoOrder({ reorderedVideos })
      if (!action.success) {
        setVideos(originalVideos)
        toast.error(action.message)
        return
      }
      toast.success(action.message)
    })
  }

  return (
    <div className='relative mt-2'>
      {isPending && (
        <div className='absolute inset-0 rounded-md flex items-center justify-center bg-gray-500 bg-opacity-50' />
      )}
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId='videos'>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className='space-y-2'
            >
              {videos.map((video, index) => (
                <Draggable
                  key={video.id}
                  draggableId={video.id}
                  index={index}
                  isDragDisabled={isPending}
                >
                  {(provided) => (
                    <VideoItem
                      video={video}
                      episodeId={episodeId}
                      provided={provided}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
