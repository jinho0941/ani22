'use client'
import { z } from 'zod'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createVideo } from '@/app/action/video'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: '제목은 최소 2글자 이상입니다.',
    })
    .max(30, { message: '제목은 최대 30글자 입니다.' }),
})

type Props = {
  episodeId: string
}

export const CreateVideoButton = ({ episodeId }: Props) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
    },
  })

  const [isOpen, setIsOpen] = useState(false)
  const onOpen = () => {
    setIsOpen(true)
  }

  const onClose = () => {
    form.reset()
    setIsOpen(false)
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const { title } = values
      const action = await createVideo({ title, episodeId })
      if (!action.success) {
        toast.error(action.message)
        return
      }
      toast.success(action.message)
      onClose()
      router.refresh()
    })
  }
  return (
    <div className='flex gap-x-4'>
      <Dialog open={isOpen}>
        <DialogTrigger asChild onClick={onOpen}>
          <div className='bg-slate-300 hover:bg-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700 shrink-0 aspect-video w-1/4 rounded-md flex justify-center items-center cursor-pointer transition-all'>
            <Plus className='h-1/2 w-1/2' />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>비디오 생성</DialogTitle>
            <DialogDescription>새로운 비디오를 만들어보세요!</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>제목</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='제목을 입력하세요. 최소 2글자 최대 30글자'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant={'destructive'}
                  type='button'
                  disabled={isPending}
                  onClick={onClose}
                >
                  취소하기
                </Button>
                <Button
                  type='submit'
                  disabled={isPending || !form.formState.isValid}
                >
                  {isPending ? '생성중' : '생성하기'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <div className='flex overflow-hidden'>
        <span className='truncate'>비디오를 생성해 보세요!</span>
      </div>
    </div>
  )
}
