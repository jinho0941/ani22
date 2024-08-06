import { Logo } from '@/components/logo'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-8 overflow-hidden bg-white dark:bg-slate-800'>
      <Logo />
      <main className='w-[450px] px-10'>{children}</main>
    </div>
  )
}
