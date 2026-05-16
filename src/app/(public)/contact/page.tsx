import { ContactForm } from "@/components/contact-form"
import { Mail, MapPin, Phone } from "lucide-react"

export const metadata = {
  title: "Contact Us | PHAGLP",
  description: "Get in touch with the PHAGLP team for any inquiries or feedback.",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground">
          Whether you have questions about our courses, research, or anything else, we're here to
          help.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="space-y-8">
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold">Email</h3>
              <p className="text-muted-foreground">support@phaglp.com</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold">Location</h3>
              <p className="text-muted-foreground">2501 Case Street, Batesville Arkansas US</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold">Phone</h3>
              <p className="text-muted-foreground">+1-870-806-4101</p>
            </div>
          </div>
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
