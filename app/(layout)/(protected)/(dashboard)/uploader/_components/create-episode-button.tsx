'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import { createEpisode } from '@/app/action/episode'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: '제목은 최소 2글자 이상입니다.',
    })
    .max(30, { message: '제목은 최대 30글자 입니다.' }),
})

export const CreateEpisodeButton = () => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
      const action = await createEpisode({ title })
      if (!action.success) {
        toast.error(action.message)
        return
      }
      toast.success(action.message)
      router.refresh()
      onClose()
    })
  }
  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild onClick={onOpen}>
        <button className='bg-slate-100 dark:bg-slate-900 aspect-[4/5] rounded-md flex items-center justify-center'>
          <Plus className='h-40 w-40' />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>애피소드 생성</DialogTitle>
          <DialogDescription>새로운 애피소드를 만들어보세요!</DialogDescription>
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
                    <Input placeholder='제목을 입력하세요.' {...field} />
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
  )
}
