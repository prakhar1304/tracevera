import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@radix-ui/react-progress";


export function MainDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Budget</CardTitle>
          <CardDescription>Overall government budget</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$10,000,000,000</div>
          <Progress value={75} className="mt-2" />
          <p className="text-sm text-muted-foreground mt-2">75% allocated</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
          <CardDescription>Currently ongoing projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,234</div>
          <Progress value={60} className="mt-2" />
          <p className="text-sm text-muted-foreground mt-2">60% of total projects</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Completed Projects</CardTitle>
          <CardDescription>Successfully finished projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">789</div>
          <Progress value={40} className="mt-2" />
          <p className="text-sm text-muted-foreground mt-2">40% of total projects</p>
        </CardContent>
      </Card>
    </div>
  )
}