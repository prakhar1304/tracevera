"use client"

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConnectWallet } from '@thirdweb-dev/react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Lock, Shield } from 'lucide-react'

type UserType = 'government' | 'contractor' | ''

export default function Login() {
  const [userType, setUserType] = useState<UserType>('')
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (userType === 'government') {
      navigate('/gov-dashboard')
    } else if (userType === 'contractor') {
      navigate('/contractor-dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center text-lg">
            Login to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 flex flex-col items-center  ">
            
            <ConnectWallet className="w-full max-w-xs" />
          </div>
          <Separator />
          <form onSubmit={handleLogin} className="space-y-4">
            <Select value={userType} onValueChange={(value: UserType) => setUserType(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select User Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="contractor">Contractor</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full" disabled={!userType}>
              <Lock className="mr-2 h-4 w-4" /> Sign in
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
          <p className="text-xs text-muted-foreground">
            © 2023 Your Company Name. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}