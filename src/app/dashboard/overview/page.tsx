import AdminOverview from '@/components/pages/AdminOverview'
import UserOverview from '@/components/pages/UserOverview'
import { authConfig } from '@/core/auth/auth.config'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

const Overviewpage = async () => {
 
    const session = await getServerSession(authConfig)

  if (!session) {
    redirect("/auth")
  }

  if (session.user.role === "admin") {
    return <AdminOverview/>
  }

  return <UserOverview/>
  
}

export default Overviewpage