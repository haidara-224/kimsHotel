import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className=' flex justify-center items-center min-h-screen  py-4 container mx-auto'>
        <SignIn />
    </div>
  )
  
}