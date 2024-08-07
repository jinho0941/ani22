'use server'

import { videoUrls } from '@/constants'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/utils'
import { faker } from '@faker-js/faker'
import { UserRole } from '@prisma/client'

// 1. 랜덤 유저 생성
export const createRandomUsers = async (
  count: number = 10,
  role: UserRole = 'GENERAL',
) => {
  const users = []
  for (let i = 0; i < count; i++) {
    const user = await db.user.create({
      data: {
        email: faker.internet.email(),
        password: hashPassword('test1234'),
        nickname: faker.internet.userName(),
        imageUrl: faker.image.avatar(),
        role: role,
      },
    })
    users.push(user)
  }
  return users
}

// 2. 랜덤 에피소드 및 관련 데이터 생성
export const createRandomEpisodesAndRelatedData = async (
  count: number = 10,
  userRole: 'UPLOADER' | 'ADMIN' = 'UPLOADER',
) => {
  const users = await db.user.findMany({
    where: { role: userRole },
    take: count,
  })
  if (users.length === 0)
    throw new Error(`No users found with role ${userRole}`)

  for (let i = 0; i < count; i++) {
    const user = users[i % users.length] // 순환 방식으로 사용자 선택

    const episode = await db.episode.create({
      data: {
        title: faker.lorem.sentence(),
        airDate: faker.date.past(),
        endDate: faker.date.future(),
        totalEpisodeCount: faker.number.int({ min: 1, max: 24 }),
        description: faker.lorem.paragraph(),
        thumbnailUrl: faker.image.url(),
        categories: faker.word.words(3).split(' '),
        userId: user.id,
      },
    })

    await db.episodeRequest.create({
      data: {
        episodeId: episode.id,
        userId: user.id,
        status: 'APPROVED',
      },
    })

    const videoCount = faker.number.int({ min: 2, max: 5 })
    for (let j = 0; j < videoCount; j++) {
      const video = await db.video.create({
        data: {
          title: faker.lorem.sentence(),
          order: j + 1,
          views: faker.number.int({ min: 0, max: 10000 }),
          url: faker.helpers.arrayElement(videoUrls),
          thumbnailUrl: faker.image.url(),
          description: faker.lorem.paragraph(),
          episodeId: episode.id,
          userId: user.id,
        },
      })

      await db.videoRequest.create({
        data: {
          videoId: video.id,
          userId: user.id,
          status: 'APPROVED',
        },
      })

      const commentUsers = await db.user.findMany({ take: 3 })
      for (const commentUser of commentUsers) {
        await db.videoComment.create({
          data: {
            content: faker.lorem.sentence(),
            userId: commentUser.id,
            videoId: video.id,
          },
        })
      }
    }
  }
}

// 4. General 유저 중 User Role Request 생성
export const createUserRoleRequests = async (count: number = 10) => {
  const users = await db.user.findMany({
    where: { role: 'GENERAL' },
    orderBy: {
      createdAt: 'desc',
    },
    take: count,
  })

  for (const user of users) {
    const existingRequest = await db.userRoleRequest.findUnique({
      where: { userId: user.id },
    })

    if (!existingRequest) {
      await db.userRoleRequest.create({
        data: {
          userId: user.id,
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraph(),
        },
      })
    }
  }
}

// 5. 랜덤 Uploader의 Pending 상태 에피소드 생성
export const createPendingEpisodes = async (count: number = 10) => {
  const uploaders = await db.user.findMany({
    where: { role: 'UPLOADER' },
    take: count,
  })
  if (uploaders.length === 0) throw new Error('No uploaders found')

  for (let i = 0; i < count; i++) {
    const uploader = uploaders[i % uploaders.length] // 순환 방식으로 업로더 선택

    const episode = await db.episode.create({
      data: {
        title: faker.lorem.sentence(),
        airDate: faker.date.past(),
        endDate: faker.date.future(),
        totalEpisodeCount: faker.number.int({ min: 3, max: 13 }),
        description: faker.lorem.paragraph(),
        thumbnailUrl: faker.image.url(),
        categories: faker.word.words(3).split(' '),
        userId: uploader.id,
      },
    })

    await db.episodeRequest.create({
      data: {
        episodeId: episode.id,
        userId: uploader.id,
        status: 'PENDING',
      },
    })
  }
}

// 6. 랜덤 에피소드의 Pending 상태 비디오 생성
export const createPendingVideos = async (count: number = 10) => {
  const episodes = await db.episode.findMany({ take: count })
  const users = await db.user.findMany({ take: count })

  if (episodes.length === 0) throw new Error('No episodes found')
  if (users.length === 0) throw new Error('No users found')

  for (let i = 0; i < count; i++) {
    const episode = episodes[i % episodes.length] // 순환 방식으로 에피소드 선택
    const user = users[i % users.length] // 순환 방식으로 사용자 선택

    const video = await db.video.create({
      data: {
        title: faker.lorem.sentence(),
        order: faker.number.int({ min: 1, max: 10 }),
        url: faker.helpers.arrayElement(videoUrls),
        thumbnailUrl: faker.image.url(),
        description: faker.lorem.paragraph(),
        episodeId: episode.id,
        userId: user.id,
      },
    })

    await db.videoRequest.create({
      data: {
        videoId: video.id,
        userId: user.id,
        status: 'PENDING',
      },
    })
  }
}
