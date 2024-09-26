'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const VerifyAccount = () => {
  const router = useRouter()
  const params = useParams<{username: string}>()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/verify-code', {
        username: params.username,
        code: data.code
      })

      toast({
        title: "Success",
        description: response.data.message,
        className: 'bg-green-100 border-green-400 text-green-800',
      })
      router.replace('/sign-in')
    } catch (error) {
      console.error("Error in verifying account", error)
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Verification failed",
        description: axiosError.response?.data.message || "An unexpected error occurred",
        variant: "destructive",
        className: 'bg-red-100 border-red-400 text-red-800',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center text-black'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
            Verify Your Account
          </h1>
          <p className='mb-4'>
            Enter the verification code sent to your email
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-black">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-black'>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Verifying...' : 'Submit'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default VerifyAccount