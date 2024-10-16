import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const ministryBudgetData = [
  { name: 'Defense', value: 3000000000 },
  { name: 'Healthcare', value: 2000000000 },
  { name: 'Education', value: 1500000000 },
  { name: 'Infrastructure', value: 2500000000 },
  { name: 'Agriculture', value: 1000000000 },
];

const gdpGrowthData = [
  { year: 2010, gdp: 1708.5 },
  { year: 2011, gdp: 1823.1 },
  { year: 2012, gdp: 1827.6 },
  { year: 2013, gdp: 1856.7 },
  { year: 2014, gdp: 2039.1 },
  { year: 2015, gdp: 2103.6 },
  { year: 2016, gdp: 2290.4 },
  { year: 2017, gdp: 2652.2 },
  { year: 2018, gdp: 2713.2 },
  { year: 2019, gdp: 2870.5 },
  { year: 2020, gdp: 2660.2 },
  { year: 2021, gdp: 3176.3 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function MainDashboard() {
  const totalBudget = ministryBudgetData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Budget</CardTitle>
            <CardDescription>Overall government budget</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ministry Budget Distribution</CardTitle>
            <CardDescription>Allocation across different ministries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ministryBudgetData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {ministryBudgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>India's GDP Growth</CardTitle>
            <CardDescription>GDP growth over the past decade (in billion USD)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gdpGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toFixed(1)} Billion`} />
                  <Legend />
                  <Line type="monotone" dataKey="gdp" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}