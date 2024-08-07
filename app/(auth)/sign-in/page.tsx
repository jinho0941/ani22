import Link from 'next/link'
import LoginForm from './_components/login-form'

export default function Page() {
  return (
    <div className='p-4 space-y-5'>
      <LoginForm />
      <div>
        <div className='text-xl font-bold'>테스트 계정</div>
        <div>
          <span className='text-indigo-500'>password:</span>
          <span className='font-bold ml-1'>test1234</span>
          <span className='text-muted-foreground ml-1'>{'(default)'}</span>
        </div>
        <div>
          <span className='text-sky-500'>email:</span>
          <span className='font-bold ml-1'>admin@mail.com</span>
          <span className='text-muted-foreground ml-1'>{'(default)'}</span>
        </div>
        <div>
          <span className='text-sky-500'>email:</span>
          <span className='font-bold ml-1'>uploader@mail.com</span>
        </div>
        <div>
          <span className='text-sky-500'>email:</span>
          <span className='font-bold ml-1'>general@mail.com</span>
        </div>
      </div>
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
