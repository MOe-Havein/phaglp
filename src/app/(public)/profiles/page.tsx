import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Instructor Profiles</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="text-center">
          <CardHeader className="flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src="/avatars/instructor-1.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <CardTitle>Dr. Jane Doe</CardTitle>
            <CardDescription>Cognitive Science & Ethics</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
