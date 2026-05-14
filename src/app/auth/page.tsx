"use client"
import React, { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/useAuth"

const SignupPage = () => {
  const { login, register, isLoginLoading, isRegisterLoading } = useAuth();
  const [tab, setTab] = useState<string>("login");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");

  // Test backend connection
  const testConnection = async () => {
    try {
      const response = await fetch('http://localhost:3003/auth/me', {
        credentials: 'include'
      });
      console.log('Backend connection test:', response.status, response.statusText);
      if (!response.ok) {
        console.warn('Backend is running but auth endpoint returned:', response.status);
      }
    } catch (error) {
      console.error('Backend connection failed - make sure your NestJS backend is running on http://localhost:3003');
      console.error('Error details:', error);
    }
  };

  React.useEffect(() => {
    testConnection();
  }, []);

  const handlereg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    register({
      username,
      password,
      name,
    });
    // Reset form and switch to login tab on success
    setTab("login");
    setUsername('');
    setPassword('');
    setName('');
  };

  const handlelog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Attempting login with:', { username, password: '***' });
    
    // Test /auth/me endpoint before login
    try {
      const meResponse = await fetch('http://localhost:3003/auth/me', {
        credentials: 'include'
      });
      console.log('Before login - /auth/me status:', meResponse.status);
    } catch (error) {
      console.log('Before login - /auth/me failed:', error);
    }
    
    login({ username, password });
    
    // Test /auth/me endpoint after login (with delay)
    setTimeout(async () => {
      try {
        const meResponse = await fetch('http://localhost:3003/auth/me', {
          credentials: 'include'
        });
        console.log('After login - /auth/me status:', meResponse.status);
        if (meResponse.ok) {
          const userData = await meResponse.json();
          console.log('After login - user data:', userData);
        }
      } catch (error) {
        console.log('After login - /auth/me failed:', error);
      }
    }, 1000);
  };

  const handleTabChange = (value: string) => {
    setTab(value);
    setUsername('');
    setPassword('');
    setName('');
  }

  const loading = isLoginLoading || isRegisterLoading;

  return (
    <div className='flex justify-center items-center min-h-screen px-4'>
      {loading && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <Badge variant="secondary" className="flex items-center gap-2">
            {tab === "login" ? "Logging in..." : "Registering..."}
            <Spinner data-icon="inline-end" />
          </Badge>
        </div>
      )}

      <Tabs value={tab} onValueChange={handleTabChange} className="w-100">
        <TabsList>
          <TabsTrigger value="register">Register</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        
        <TabsContent value="register">
          <Card className={'w-full max-w-md p-6'}>
            <CardContent>
              <h2 className='text-center text-2xl font-semibold mb-4'>Register</h2>
              <form onSubmit={handlereg} className="space-y-4">
                <Input 
                  type='text' 
                  placeholder='Full Name' 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className={'p-4'} 
                  required 
                />
                <Input 
                  type='text' 
                  placeholder='Username' 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className={'p-4'} 
                  required 
                />
                <Input 
                  type='password' 
                  placeholder='Password' 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className={'p-4'} 
                  required 
                />
                <div className="flex justify-center">
                  <Button type='submit' className="w-full sm:w-auto" disabled={loading}>
                    {isRegisterLoading ? "Registering..." : "Register"}
                  </Button>
                </div>
                <h3 className='text-center'>
                  Already have an account?{" "}
                  <span onClick={() => setTab("login")} className="text-blue-600 hover:underline hover:cursor-pointer">
                    Login
                  </span>
                </h3>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="login">
          <Card className={'w-full max-w-md p-6'}>
            <CardContent>
              <h2 className='text-center text-2xl font-semibold mb-4'>Login</h2>
              <form onSubmit={handlelog} className="space-y-4">
                <Input 
                  type='text' 
                  placeholder='Username' 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className={'p-4'} 
                  required 
                />
                <Input 
                  type='password' 
                  placeholder='Password' 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className={'p-4'} 
                  required 
                />
                <div className="flex flex-col gap-4 justify-center items-center">
                  <Button type='submit' className="w-full sm:w-auto" disabled={loading}>
                    {isLoginLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
                <h3 className='text-center'>
                  Don't have an account?{" "}
                  <span onClick={() => setTab("register")} className="text-blue-600 hover:underline hover:cursor-pointer">
                    Register
                  </span>
                </h3>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SignupPage