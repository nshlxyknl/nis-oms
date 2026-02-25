import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"

const StatusCard = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Today's Status
        </CardTitle>
        <CardDescription>Your current attendance and activity status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="font-medium">Checked In</p>
              <p className="text-sm text-muted-foreground">9:00 AM</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
           <AlertCircle className="h-8 w-8 text-green-500" />
            <div>
              <p className="font-medium">Checked Out</p>
              <p className="text-sm text-muted-foreground">5:00 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-green-600 border-green-200">
              On Time
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default StatusCard