import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DeviceCard } from "@/components/DeviceCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDevices, UroMeterDevice } from "@/data/mockData";
import { Search, Activity, AlertTriangle, Wifi, WifiOff, RefreshCw } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState<UroMeterDevice[]>(mockDevices);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Filter devices based on search term
  const filteredDevices = devices.filter(
    device =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    total: devices.length,
    active: devices.filter(d => d.status === 'active').length,
    warning: devices.filter(d => d.status === 'warning').length,
    error: devices.filter(d => d.status === 'error').length,
    offline: devices.filter(d => d.status === 'offline').length
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prevDevices => 
        prevDevices.map(device => {
          // Simulate minor changes for active devices
          if (device.status === 'active') {
            const flowVariation = (Math.random() - 0.5) * 2;
            const volumeIncrement = Math.random() * 1;
            
            return {
              ...device,
              lastUpdate: new Date().toISOString(),
              currentFlowRate: Math.max(0, device.currentFlowRate + flowVariation),
              totalVolume: device.totalVolume + volumeIncrement
            };
          }
          return device;
        })
      );
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleDeviceClick = (deviceId: string) => {
    navigate(`/device/${deviceId}`);
  };

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // In a real app, this would trigger a data refresh
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-primary mr-3" />
              <h1 className="medical-title">Uro-Monitor Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 mr-1" />
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Devices</CardDescription>
              <CardTitle className="medical-metric">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <Wifi className="h-3 w-3 text-status-active" />
                Active
              </CardDescription>
              <CardTitle className="medical-metric text-status-active">{stats.active}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-status-warning" />
                Warning
              </CardDescription>
              <CardTitle className="medical-metric text-status-warning">{stats.warning}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-status-error" />
                Error
              </CardDescription>
              <CardTitle className="medical-metric text-status-error">{stats.error}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <WifiOff className="h-3 w-3 text-status-offline" />
                Offline
              </CardDescription>
              <CardTitle className="medical-metric text-status-offline">{stats.offline}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge variant="active" className="gap-1">
              <div className="w-2 h-2 bg-status-active-foreground rounded-full" />
              Active
            </Badge>
            <Badge variant="warning" className="gap-1">
              <div className="w-2 h-2 bg-status-warning-foreground rounded-full" />
              Warning
            </Badge>
            <Badge variant="error" className="gap-1">
              <div className="w-2 h-2 bg-status-error-foreground rounded-full" />
              Error
            </Badge>
            <Badge variant="offline" className="gap-1">
              <div className="w-2 h-2 bg-status-offline-foreground rounded-full" />
              Offline
            </Badge>
          </div>
        </div>

        {/* Device Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onClick={handleDeviceClick}
            />
          ))}
        </div>

        {filteredDevices.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="medical-subtitle mb-2">No devices found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or check if devices are properly connected.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}