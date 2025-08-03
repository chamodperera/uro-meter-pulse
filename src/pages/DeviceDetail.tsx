import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeviceChart } from "@/components/DeviceChart";
import { mockDevices, generateMeasurementData, MeasurementData, UroMeterDevice } from "@/data/mockData";
import { 
  ArrowLeft, 
  Activity, 
  Battery, 
  MapPin, 
  Clock, 
  AlertTriangle,
  Gauge,
  Calendar
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default function DeviceDetail() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [device, setDevice] = useState<UroMeterDevice | null>(null);
  const [measurementData, setMeasurementData] = useState<MeasurementData[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (deviceId) {
      const foundDevice = mockDevices.find(d => d.id === deviceId);
      setDevice(foundDevice || null);
      
      if (foundDevice) {
        const data = generateMeasurementData(deviceId);
        setMeasurementData(data);
      }
    }
  }, [deviceId]);

  // Simulate real-time updates
  useEffect(() => {
    if (!device) return;

    const interval = setInterval(() => {
      // Update device data
      if (device.status === 'active') {
        const volumeIncrement = Math.random() * 1;
        
        setDevice(prev => prev ? {
          ...prev,
          lastUpdate: new Date().toISOString(),
          totalVolume: prev.totalVolume + volumeIncrement
        } : null);

        // Add new measurement point
        const newMeasurement: MeasurementData = {
          timestamp: new Date().toISOString(),
          flowRate: 0,
          volume: device.totalVolume + volumeIncrement,
          pressure: 0
        };

        setMeasurementData(prev => [...prev.slice(-287), newMeasurement]); // Keep last 24 hours (288 points)
      }
      
      setLastUpdate(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [device]);

  if (!device) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="medical-title mb-4">Device Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The requested device could not be found.
          </p>
          <Button onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: UroMeterDevice['status']) => {
    switch (status) {
      case 'active':
        return { variant: 'active' as const, label: 'Active' };
      case 'warning':
        return { variant: 'warning' as const, label: 'Warning' };
      case 'error':
        return { variant: 'error' as const, label: 'Error' };
      case 'offline':
        return { variant: 'offline' as const, label: 'Offline' };
      default:
        return { variant: 'offline' as const, label: 'Unknown' };
    }
  };

  const statusConfig = getStatusConfig(device.status);
  const latestMeasurement = measurementData[measurementData.length - 1];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="mr-4 gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Button>
              <div>
                <h1 className="medical-title">{device.name}</h1>
                <p className="text-sm text-muted-foreground font-mono">{device.id}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant={statusConfig.variant}>
                <Activity className="w-3 h-3 mr-1" />
                {statusConfig.label}
              </Badge>
              <div className="text-sm text-muted-foreground">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Device Info & Current Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Device Information */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="medical-subtitle">Device Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{device.location}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Battery className={`w-4 h-4 ${
                  device.batteryLevel > 50 ? 'text-status-active' :
                  device.batteryLevel > 20 ? 'text-status-warning' : 'text-status-error'
                }`} />
                <span className="text-sm">Battery: {device.batteryLevel}%</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {formatDistanceToNow(new Date(device.lastUpdate), { addSuffix: true })}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {format(new Date(device.lastUpdate), 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Total Volume */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="medical-subtitle flex items-center gap-2">
                <Gauge className="w-5 h-5 text-chart-secondary" />
                Total Volume
              </CardTitle>
              <CardDescription>Cumulative measurement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-chart-secondary">
                  {device.totalVolume.toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">mL</div>
                {latestMeasurement && (
                  <div className="text-xs text-muted-foreground">
                    Last reading: {latestMeasurement.volume.toFixed(1)} mL
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {device.alerts.length > 0 && (
          <Card className="medical-card mb-8 border-status-warning/20 bg-status-warning/5">
            <CardHeader>
              <CardTitle className="medical-subtitle flex items-center gap-2 text-status-warning">
                <AlertTriangle className="w-5 h-5" />
                Active Alerts ({device.alerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {device.alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className="flex items-start justify-between p-3 rounded-lg bg-card border border-card-border"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">
                        {alert.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    <Badge 
                      variant={alert.type === 'error' ? 'error' : 'warning'}
                      className="ml-3"
                    >
                      {alert.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts */}
        <DeviceChart 
          data={measurementData} 
          title={`${device.name} - Volume Monitoring (24 Hours)`}
        />
      </main>
    </div>
  );
}