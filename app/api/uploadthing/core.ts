import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .middleware(async ({ req }) => {
      const userId = await getCurrentUserId()
      return { userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId }
    }),

  videoUploader: f({ video: { maxFileSize: '128MB' } })
    .middleware(async ({ req }) => {
      const userId = await getCurrentUserId()
      return { userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

import { createRouteHandler } from 'uploadthing/next'
import { getCurrentUserId } from '@/app/data/user'

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
})
