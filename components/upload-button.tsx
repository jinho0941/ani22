'use client'

import { UploadButton as UploadtingButton } from '@/lib/uploadthing'

type UploadButtonProps = {
  onChange: (url?: string) => void
  onUploadBegin: () => void
  CustomButton: React.ComponentType<{ ready: boolean }>
}

export default function UploadButton({
  onChange,
  onUploadBegin,
  CustomButton,
}: UploadButtonProps) {
  return (
    <UploadtingButton
      endpoint='imageUploader'
      appearance={{
        allowedContent: 'hidden',
      }}
      content={{
        button: ({ ready }) => <CustomButton ready={ready} />,
      }}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url)
      }}
      onUploadError={() => {
        throw new Error(
          '이미지를 업로드 하는중에 에러가 발생하였습니다. 다시 시도해주세요.',
        )
      }}
      onUploadBegin={onUploadBegin}
    />
  )
}
