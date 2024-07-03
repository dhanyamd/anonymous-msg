'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from "usehooks-ts"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast, useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/SignupSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/SigninSchema"

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();

  //implementing zod
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
      const result =  await signIn('credentials',{
        redirect : true,
        identifier: data.identifier,
        password : data.password
       })  
       if (result?.error){
        toast({
            title: "Login failed",
            description: "Incorrect username or password",
            variant : "destructive"
        })
       } 
       if(result?.url){
        router.replace('/dashboard')
       }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="font-extrabold text-4xl tracking-tight lg:text-5xl mb-6">
            Join anonymous message
          </h1>
          <p className="mb-4">
            Signin to send anonymous messages
          </p>
        </div>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
             name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem >
                  <FormLabel>Email/username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username" {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
             name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem >
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" >
             Signin
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member ? {''}
            <Link href='/sign-up' className="text-blue-600 hover:text-blue-800">
                Signup
             </Link>
          </p>
        </div>
      </div >
    
    </div>
  )
}

