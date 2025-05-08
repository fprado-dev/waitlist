'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
});

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // Import the waitlist service
      const { addToWaitlist } = await import('@/lib/waitlist-service');

      // Add email to waitlist in Supabase
      const result = await addToWaitlist(values.email);

      if (result.success) {
        setIsSubmitted(true);
        toast.success('You have been added to the waitlist!');
      } else {
        toast.error(result.error || 'Failed to join waitlist. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="flex w-full max-w-xl flex-col items-center gap-8 text-center">
        <Image
          className="dark:invert"
          src="/tw-logo.png"
          alt="TierWise logo"
          width={100}
          height={38}
          priority
        />

        <div className="space-y-4">
          <p className="text-lg text-slate-600 dark:text-slate-400">
            <b>TierWise</b> - Strategic pricing for AI products
          </p>
          <p className="text-md text-pretty text-muted-foreground ">
            A guided, wizard-style platform that assists founders in creating optimal pricing tier structures through AI-powered recommendations, cost calculations, and industry benchmarking. It features an intuitive pricing tier builder.

          </p>
        </div>

        {!isSubmitted ? (
          <div className="w-full space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-xl font-semibold">Join our waitlist</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Be the first to know when we launch. Enter your email below.
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-[#1b263b] hover:bg-[#1b263b]/90" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
                </Button>
              </form>
            </Form>
          </div>
        ) : (
          <div className="w-full space-y-4 rounded-lg border border-green-100 bg-green-50 p-6 dark:border-green-900 dark:bg-green-900/20">
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-400">Thank you for joining!</h2>
            <p className="text-sm text-green-600 dark:text-green-500">
              {`We'll notify you when TierWise launches. Stay tuned for strategic AI pricing solutions that will transform your business.`}
            </p>
          </div>
        )}
      </main>

      <footer className="mt-16 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>© {new Date().getFullYear()} TierWise. All rights reserved.</p>
      </footer>

      <Toaster position="top-center" />
    </div>
  );
}
