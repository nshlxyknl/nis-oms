import { Button } from '../ui/button'
import { signOut } from 'next-auth/react'

const UserDashboard = () => {

  const handlesignout=async()=>{
     await signOut({
      redirect: true,
      callbackUrl: '/auth', 
    });
  }
  return (
    <div>UserDashboard
      <Button onClick={()=>handlesignout()} >logout</Button>
    </div>
  )
}

export default UserDashboard