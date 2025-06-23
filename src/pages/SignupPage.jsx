import SignupForm from '@/components/auth/SignupForm'
import React from 'react'

const SignupPage = () => {
  return (
    <div className='flex max-w-7xl mx-auto px-4 py-16 gap-2'>
      <img src="https://res.cloudinary.com/dhopew3ev/image/upload/v1747895216/register_animated_qg52vd.svg" alt="Signup Illustration" className='w-1/2 max-[1080px]:hidden'/>
      <div className='w-1/2 flex items-center justify-center max-[1080px]:w-full'>
        <SignupForm />
      </div>
    </div>
  )
}

export default SignupPage