'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { sendUploaderApprovalRequest } from '@/app/action/user-role-request'

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: '제목은 최소 2글자 이상입니다.',
    })
    .max(30, { message: '제목은 최대 30글자 입니다.' }),
  content: z
    .string()
    .min(5, {
      message: '내용은 최소 5 이상입니다.',
    })
    .max(100, { message: '내용은 최대 100글자 이하입니다.' }),
})

export const RequestUserRoleButton = () => {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
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
      const { title, content } = values
      const action = await sendUploaderApprovalRequest({ title, content })
      if (!action.success) {
        toast.error(action.message)
        return
      }
      toast.success(action.message)
      onClose()
    })
  }
  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild onClick={onOpen}>
        <Button>신청하기</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>권한 승인 요청(업로더)</DialogTitle>
          <DialogDescription>
            권한 신청을 하여 업로더의 권한을 획득하세요!
          </DialogDescription>
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
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>내용</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='내용을 입력하세요. (최소5 최대 100)'
                      {...field}
                      className='resize-none'
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
  )
}
