import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card"
import React from 'react'

interface KPI {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

export const KPI: React.FC<{ kpis: KPI[] }> = ({ kpis }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 sm:grid-cols-2">
      {kpis.map((kpi, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {kpi.title}
            </CardTitle>
            {kpi.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <p className="text-xs text-muted-foreground">
              {kpi.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default KPI