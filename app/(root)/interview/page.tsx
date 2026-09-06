import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth.action'
import Agent from '@/components/agent'

const page = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in'); // or wherever your login page is
  }

  return (
    <>
      <h3>Interview Generation</h3>
      <Agent userName={user.name} userId={user.id} type="generate" />
    </>
  )
}

export default page