'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"


const page = () => {
  const { toast } = useToast()
  const router = useRouter();

  //zod implementation

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>)=>{
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })
    if(result?.error){
      if(result.error == 'CredentialsSignin'){
        toast({
          title: "Login failed",
          description:"Incorrect username or password",
          variant: "destructive",
          className: 'bg-red-100 border-red-400 text-red-800',
        })
      }else{
        toast({
          title: "Login failed",
          description: result.error,
          variant: "destructive",
          className: 'bg-red-100 border-red-400 text-red-800',
        })
      }
      
    }

    if(result?.url){
      router.replace('/dashboard')
    }

  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rouned-lg shadow-md text-black ">
        <div className="text-center">
          <h1 className="text-4l font-extrabold tracking-tight lg:text-5xl mb-6">Join Mystery Message</h1>
          <p>Sign in to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email/Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter email address/username" {...field}
                onChange={(e)=>{
                  field.onChange(e)
                }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          </form>
        </Form>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter password" type="password" {...field}
                onChange={(e)=>{
                  field.onChange(e)
                }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          Sign in
        </Button>
          </form>
        </Form>
        {/* <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div> */}
      </div>
    </div>
  )
}

export default page