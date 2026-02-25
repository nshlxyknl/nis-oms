import React from 'react'
import StatusCard from '../cards/StatusCard'
import FeaturesCard from '../cards/FeaturesCard'
import NoticeCard from '../cards/NoticeCard'

const UserOverview = () => {
  return (
          <main className="w-full mx-auto px-6 py-8">
            <StatusCard/>
            <FeaturesCard/>
            <NoticeCard/>
</main>
  )
}

export default UserOverview