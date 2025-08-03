import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MeasurementData } from "@/data/mockData";
import { format } from "date-fns";

interface DeviceChartProps {
  data: MeasurementData[];
  title: string;
}

export function DeviceChart({ data, title }: DeviceChartProps) {
  // Format data for charts
  const chartData = data.map(item => ({
    ...item,
    time: format(new Date(item.timestamp), 'HH:mm'),
    fullTime: format(new Date(item.timestamp), 'MMM dd, HH:mm')
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-card-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-card-foreground mb-2">{data.fullTime}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm">
              <span className="font-medium" style={{ color: entry.color }}>
                {entry.name}:
              </span>
              <span className="ml-2">
                {entry.value.toFixed(1)} {entry.unit || ''}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="medical-card">
      <CardHeader>
        <CardTitle className="medical-subtitle">{title}</CardTitle>
        <CardDescription>
          Real-time monitoring data over the last 24 hours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="flow" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="flow">Flow Rate</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="pressure">Pressure</TabsTrigger>
          </TabsList>
          
          <TabsContent value="flow" className="space-y-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="flowRate"
                    stroke="hsl(var(--chart-primary))"
                    fill="hsl(var(--chart-primary) / 0.2)"
                    strokeWidth={2}
                    name="Flow Rate"
                    unit="mL/min"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="volume" className="space-y-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="hsl(var(--chart-secondary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-secondary))", strokeWidth: 2, r: 3 }}
                    name="Total Volume"
                    unit="mL"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="pressure" className="space-y-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="pressure"
                    stroke="hsl(var(--chart-tertiary))"
                    fill="hsl(var(--chart-tertiary) / 0.2)"
                    strokeWidth={2}
                    name="Pressure"
                    unit="mmHg"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}