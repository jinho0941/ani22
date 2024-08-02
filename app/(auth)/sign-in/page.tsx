import Link from 'next/link'
import LoginForm from './_components/login-form'

export default function Page() {
  return (
    <div className='p-4 space-y-5'>
      <LoginForm />
      <div className='flex items-center justify-center mt-2 gap-x-2'>
        <p className='text-gray-500'>
          처음인가요?{' '}
          <Link
            href='/sign-up'
            className='font-semibold underline text-primary'
          >
            회원가입하기
          </Link>
        </p>
      </div>
    </div>
  )
}
