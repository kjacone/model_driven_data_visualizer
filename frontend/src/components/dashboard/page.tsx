import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs";
import * as shadcnComponents from "@/utils/shadcn";
import { Overview } from "@/components/dashboard/components/overview";
import { RecentSales } from "@/components/dashboard/components/recent-sales";
import KPI from "./KPI";
import LoginForm from "@/registry/default/block/authentication-01";
import Charts from "@/registry/new-york/block/chart-bar-active";
import Dashboard from "@/registry/new-york/block/dashboard-07";
import { SidebarTrigger } from "../ui/sidebar";




const kpis = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1% from last month",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-4 w-4 text-muted-foreground"
      >
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: "Subscriptions",
    value: "+2350",
    change: "+180.1% from last month",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-4 w-4 text-muted-foreground"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Sales",
    value: "+12,234",
    change: "+19% from last month",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-4 w-4 text-muted-foreground"
      >
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    title: "Active Now",
    value: "+573",
    change: "+201 since last hour",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-4 w-4 text-muted-foreground"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
];

const tabsData = [
  {
    value: "overview",
    label: "Data Overview",
    content: (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              You made 265 sales this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    value: "analytics",
    label: "Analytics",
    content: <div> <Dashboard /> </div>, // Replace with actual content
  },
  {
    value: "reports",
    label: "Reports",
    content: <div> <Charts /> </div>, // Replace with actual content
  },
  {
    value: "notifications",
    label: "Notifications",
    content: <div> <LoginForm /></div>, // Replace with actual content
  },
];


export default function DashboardPage() {
  return (
    <>
    {/* <SidebarTrigger /> */}
      <div className="flex-col md:flex md:flex-shrink-0">
        <div className="flex-1 space-y-4 p-8 pt-1">

          <KPI kpis={kpis} />
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              {tabsData.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabsData.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="space-y-4">
              
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </>
  );
}


