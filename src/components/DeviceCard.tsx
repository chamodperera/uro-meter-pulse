import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Battery, MapPin, Droplets, Clock } from "lucide-react";
import { UroMeterDevice } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";

interface DeviceCardProps {
  device: UroMeterDevice;
  onClick: (deviceId: string) => void;
}

const getStatusConfig = (status: UroMeterDevice['status']) => {
  switch (status) {
    case 'active':
      return {
        className: 'status-active',
        label: 'Active',
        icon: Activity
      };
    case 'warning':
      return {
        className: 'status-warning',
        label: 'Warning',
        icon: Activity
      };
    case 'error':
      return {
        className: 'status-error',
        label: 'Error',
        icon: Activity
      };
    case 'offline':
      return {
        className: 'status-offline',
        label: 'Offline',
        icon: Activity
      };
    default:
      return {
        className: 'status-offline',
        label: 'Unknown',
        icon: Activity
      };
  }
};

const getBatteryColor = (level: number) => {
  if (level > 50) return 'text-status-active';
  if (level > 20) return 'text-status-warning';
  return 'text-status-error';
};

export function DeviceCard({ device, onClick }: DeviceCardProps) {
  const statusConfig = getStatusConfig(device.status);
  const StatusIcon = statusConfig.icon;
  
  const handleClick = () => {
    onClick(device.id);
  };

  return (
    <Card 
      className="medical-card cursor-pointer group hover:border-primary/20"
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="medical-subtitle leading-tight">{device.name}</h3>
            <p className="text-xs text-muted-foreground font-mono">{device.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={statusConfig.className} variant="secondary">
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Location */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{device.location}</span>
        </div>
        
        {/* Current Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Droplets className="w-3 h-3 text-chart-primary" />
              <span className="text-xs text-muted-foreground">Flow Rate</span>
            </div>
            <p className="medical-metric text-sm">
              {device.currentFlowRate.toFixed(1)} 
              <span className="text-xs font-normal text-muted-foreground ml-1">mL/min</span>
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-chart-secondary" />
              <span className="text-xs text-muted-foreground">Volume</span>
            </div>
            <p className="medical-metric text-sm">
              {device.totalVolume.toFixed(0)}
              <span className="text-xs font-normal text-muted-foreground ml-1">mL</span>
            </p>
          </div>
        </div>
        
        {/* Battery & Last Update */}
        <div className="flex items-center justify-between pt-2 border-t border-card-border">
          <div className="flex items-center gap-1">
            <Battery className={`w-4 h-4 ${getBatteryColor(device.batteryLevel)}`} />
            <span className={`text-sm font-medium ${getBatteryColor(device.batteryLevel)}`}>
              {device.batteryLevel}%
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(device.lastUpdate), { addSuffix: true })}
            </span>
          </div>
        </div>
        
        {/* Alerts */}
        {device.alerts.length > 0 && (
          <div className="pt-2 border-t border-card-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-status-warning rounded-full animate-pulse" />
              <span className="text-xs text-status-warning font-medium">
                {device.alerts.length} alert{device.alerts.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}