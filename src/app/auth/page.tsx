"use client"
import React, { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation'



const SignupPage = () => {
  const router =useRouter()
     const [loading, setLoading] = useState<boolean>(false);
     const [tab, setTab] = useState<string>("login");
     const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");


const handlereg = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Registration failed");
    } else {
      toast.success("Registered successfully!");
      await handleTabChange("login");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};


const handlelog = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
 const  result= await   signIn("credentials", {
      redirect: false,
      username,
      password,
    });
if (result?.ok) {
  router.replace("/dashboard"); 
  toast.success("Login success!");
}      

  } catch (err) {
    console.error(err);
    toast.error("Login failed");
  } finally {
    setLoading(false);
  }
};

const handleTabChange=(value: string)=>{
  setTab(value);
  setUsername('')
  setPassword('')
}


  return (
 <div className='flex justify-center items-center min-h-screen px-4'>

        {
            loading ?
            <>
            <Skeleton className="h-12 w-12 rounded-full" />
              <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">

            <Badge variant="secondary" className="flex items-center gap-2">
        Checking
        <Spinner data-icon="inline-end"  />
      </Badge>
      </div>
      </>
      :

            <Tabs value={tab} onValueChange={handleTabChange} className="w-100">
  <TabsList>
    <TabsTrigger value="register">Register</TabsTrigger>
    <TabsTrigger value="login">Login</TabsTrigger>
  </TabsList>
  <TabsContent value="register"> 
    <Card className={'w-full max-w-md p-6'}>
                <CardContent >
                    <h2 className='text-center text-2xl font-semibold mb-4'> Register </h2>
                           <form  onSubmit={handlereg} className="space-y-4">
                               <Input type='text' placeholder= 'username' value={username} onChange={(e) => setUsername(e.target.value)} className={'p-4'}/>
                               <Input type='password' placeholder= 'password' value={password} onChange={(e) => setPassword(e.target.value)} className={'p-4'}/>
                              <div className="flex justify-center">
                               <Button type='submit' className="w-full sm:w-auto" disabled={loading}> {loading? "Registering..":"Register"} </Button>
                               </div>
                  <h3 className='text-center'> Already have an account? {""}
                    <span onClick={() => setTab("login")} className="text-blue-600 hover:underline hover: cursor-pointer">
                    Login
                    </span>
                  </h3>
                                </form>
                </CardContent>
            </Card>
            </TabsContent>
  <TabsContent value="login"> <Card className={'w-full max-w-md p-6'}>
                <CardContent >
                     <h2 className='text-center text-2xl font-semibold mb-4'> Login </h2>
          <form onSubmit={handlelog} className="space-y-4">
            <Input type='text' placeholder='username' value={username} onChange={(e) => setUsername(e.target.value)} className={'p-4'} />
            <Input type='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} className={'p-4'} />
            <div className="flex flex-col gap-4 justify-center items-center">
              <Button type='submit' className="w-full sm:w-auto" disabled={loading}> {loading ? "Logging in.." : "Login"}</Button>
             
            </div>

            <h3 className='text-center'> Don't have an account? {""}
              <span onClick={() => setTab("register")} className="text-blue-600 hover:underline hover: cursor-pointer">
                Register
              </span>
            </h3>
          </form>
                </CardContent>
            </Card></TabsContent>
</Tabs>

}
        </div>  )
}

export default SignupPage