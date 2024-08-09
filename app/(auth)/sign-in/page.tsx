import Link from 'next/link'
import LoginForm from './_components/login-form'
import { accounts } from '@/constants'
import { AccountItem } from './_components/account-item'

export default function Page() {
  return (
    <div className='p-4 space-y-5'>
      <LoginForm />
      <div className='space-y-2'>
        <h3 className='text-xl font-bold'>테스트 계정</h3>
        {accounts.map((account, index) => (
          <AccountItem
            key={index}
            label={account.label}
            value={account.value}
          />
        ))}
      </div>
      <div className='flex items-center justify-center mt-2 gap-x-2'>
        <p className='text-gray-500'>
          처음인가요?
          <Link
            href='/sign-up'
            className='ml-1 font-semibold underline text-primary'
          >
            회원가입하기
          </Link>
        </p>
      </div>
    </div>
  )
}
