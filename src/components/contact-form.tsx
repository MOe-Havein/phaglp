"use client"

import { useState } from "react"
import { submitContactForm } from "@/lib/contact-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Send, CheckCircle2 } from "lucide-react"

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    }

    try {
      const result = await submitContactForm(data)
      if (result.success) {
        toast.success("Message sent! We'll get back to you soon.")
        ;(event.target as HTMLFormElement).reset()
      } else {
        if (typeof result.error === "string") {
          toast.error(result.error)
        } else {
          toast.error("Please check your input.")
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all duration-300">
      <div className="mb-8 text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Send us a message</h2>
        <p className="text-muted-foreground">Have a question or feedback? We'd love to hear from you.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="relative group">
            <Input 
              id="name" 
              name="name" 
              placeholder=" " 
              required 
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              className="peer h-14 pt-5 pb-2 px-4 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary shadow-sm"
            />
            <label 
              htmlFor="name" 
              className="absolute left-4 top-4 text-muted-foreground transition-all duration-200 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-primary peer-valid:top-1.5 peer-valid:text-[11px] font-medium"
            >
              Name
            </label>
            <CheckCircle2 className="absolute right-4 top-4 w-5 h-5 text-green-500 opacity-0 peer-valid:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>

          {/* Email Field */}
          <div className="relative group">
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder=" " 
              required 
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              className="peer h-14 pt-5 pb-2 px-4 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary shadow-sm"
            />
            <label 
              htmlFor="email" 
              className="absolute left-4 top-4 text-muted-foreground transition-all duration-200 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-primary peer-valid:top-1.5 peer-valid:text-[11px] font-medium"
            >
              Email address
            </label>
            <CheckCircle2 className="absolute right-4 top-4 w-5 h-5 text-green-500 opacity-0 peer-valid:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        </div>

        {/* Subject Field */}
        <div className="relative group">
          <Input 
            id="subject" 
            name="subject" 
            placeholder=" " 
            required 
            onFocus={() => setFocusedField('subject')}
            onBlur={() => setFocusedField(null)}
            className="peer h-14 pt-5 pb-2 px-4 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary shadow-sm"
          />
          <label 
            htmlFor="subject" 
            className="absolute left-4 top-4 text-muted-foreground transition-all duration-200 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-primary peer-valid:top-1.5 peer-valid:text-[11px] font-medium"
          >
            Subject
          </label>
          <CheckCircle2 className="absolute right-4 top-4 w-5 h-5 text-green-500 opacity-0 peer-valid:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        {/* Message Field */}
        <div className="relative group">
          <Textarea
            id="message"
            name="message"
            placeholder=" "
            required
            onFocus={() => setFocusedField('message')}
            onBlur={() => setFocusedField(null)}
            className="peer min-h-[160px] pt-7 pb-4 px-4 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary shadow-sm resize-y"
          />
          <label 
            htmlFor="message" 
            className="absolute left-4 top-4 text-muted-foreground transition-all duration-200 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-primary peer-valid:top-2 peer-valid:text-[11px] font-medium"
          >
            Your message
          </label>
          {focusedField === 'message' && (
             <div className="absolute right-3 bottom-3 text-[10px] text-muted-foreground/50 pointer-events-none font-medium">
               Markdown supported
             </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {loading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Send className="mr-2 h-5 w-5" />
          )}
          Send Message
        </Button>
      </form>
    </div>
  )
}
