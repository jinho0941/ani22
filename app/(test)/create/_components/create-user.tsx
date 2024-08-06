import { createUser, CreateUserProps } from '@/app/action/user'
import { ActionButton } from '@/components/action-button'
import { Button } from '@/components/ui/button'
import { faker } from '@faker-js/faker'
import { User } from '@prisma/client'

type Props = {
  users: User[]
}

export const CreateUser = ({ users }: Props) => {
  return (
    <div className='space-y-2'>
      <ActionButton<CreateUserProps, User>
        fn={createUser}
        param={{
          email: `${faker.word.words(1)}@mail.com`,
          nickname: faker.word.words(2),
        }}
      >
        Create User
      </ActionButton>
      <div className='bg-white rounded-md h-80 text-white overflow-y-scroll p-4 flex flex-col gap-y-2 scrollbar-hide'>
        {users.map((user) => (
          <Button>{user.email}</Button>
        ))}
      </div>
    </div>
  )
}
