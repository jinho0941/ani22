import {
  sendUploaderApprovalRequest,
  SendUploaderApprovalRequestProps,
} from '@/app/action/user-role-request'
import { ActionButton } from '@/components/action-button'
import { faker } from '@faker-js/faker'
import { UserRoleRequest } from '@prisma/client'

export const CreateUserRoleRequest = () => {
  return (
    <ActionButton<SendUploaderApprovalRequestProps, UserRoleRequest>
      fn={sendUploaderApprovalRequest}
      param={{ title: faker.word.words(3), content: faker.word.words(8) }}
    >
      Create User Role Request
    </ActionButton>
  )
}
