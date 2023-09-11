import prisma from '@/app/libs/prismadb'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/options'

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions)

    // console.log('session API: ', session)

    if (!session || !session.user.email)
      return NextResponse.json('User not found', { status: 404 })

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    })

    // console.log('CurrentUser DB: ',currentUser)

    if (!currentUser) return NextResponse.json('User not found', { status: 404 })

    return NextResponse.json(currentUser)
  } catch (error) {
    console.log(error)
  }
}
