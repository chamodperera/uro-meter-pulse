export interface UroMeterDevice {
  id: string;
  name: string;
  status: 'active' | 'warning' | 'error' | 'offline';
  lastUpdate: string;
  location: string;
  currentFlowRate: number;
  totalVolume: number;
  batteryLevel: number;
  alerts: Alert[];
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
}

export interface MeasurementData {
  timestamp: string;
  flowRate: number;
  volume: number;
  pressure: number;
}

export const mockDevices: UroMeterDevice[] = [
  {
    id: 'UM-001',
    name: 'Uro-Meter ICU-A',
    status: 'active',
    lastUpdate: new Date(Date.now() - 30000).toISOString(),
    location: 'ICU Ward A - Room 101',
    currentFlowRate: 45.2,
    totalVolume: 1250,
    batteryLevel: 92,
    alerts: []
  },
  {
    id: 'UM-002',
    name: 'Uro-Meter ICU-B',
    status: 'warning',
    lastUpdate: new Date(Date.now() - 120000).toISOString(),
    location: 'ICU Ward B - Room 205',
    currentFlowRate: 28.7,
    totalVolume: 890,
    batteryLevel: 15,
    alerts: [
      {
        id: 'alert-1',
        type: 'warning',
        message: 'Low battery level detected',
        timestamp: new Date(Date.now() - 60000).toISOString()
      }
    ]
  },
  {
    id: 'UM-003',
    name: 'Uro-Meter Surgical',
    status: 'active',
    lastUpdate: new Date(Date.now() - 15000).toISOString(),
    location: 'Surgical Ward - OR 3',
    currentFlowRate: 62.1,
    totalVolume: 2100,
    batteryLevel: 78,
    alerts: []
  },
  {
    id: 'UM-004',
    name: 'Uro-Meter Emergency',
    status: 'error',
    lastUpdate: new Date(Date.now() - 300000).toISOString(),
    location: 'Emergency Room - Bed 12',
    currentFlowRate: 0,
    totalVolume: 450,
    batteryLevel: 0,
    alerts: [
      {
        id: 'alert-2',
        type: 'error',
        message: 'Device disconnected - check connections',
        timestamp: new Date(Date.now() - 180000).toISOString()
      },
      {
        id: 'alert-3',
        type: 'error',
        message: 'Battery depleted',
        timestamp: new Date(Date.now() - 300000).toISOString()
      }
    ]
  },
  {
    id: 'UM-005',
    name: 'Uro-Meter Pediatric',
    status: 'active',
    lastUpdate: new Date(Date.now() - 45000).toISOString(),
    location: 'Pediatric Ward - Room 308',
    currentFlowRate: 18.3,
    totalVolume: 320,
    batteryLevel: 88,
    alerts: []
  },
  {
    id: 'UM-006',
    name: 'Uro-Meter Recovery',
    status: 'offline',
    lastUpdate: new Date(Date.now() - 600000).toISOString(),
    location: 'Recovery Ward - Room 115',
    currentFlowRate: 0,
    totalVolume: 0,
    batteryLevel: 45,
    alerts: [
      {
        id: 'alert-4',
        type: 'warning',
        message: 'Device offline for over 5 minutes',
        timestamp: new Date(Date.now() - 300000).toISOString()
      }
    ]
  }
];

// Generate realistic measurement data for charts
export const generateMeasurementData = (deviceId: string, hours: number = 24): MeasurementData[] => {
  const data: MeasurementData[] = [];
  const now = new Date();
  const device = mockDevices.find(d => d.id === deviceId);
  
  if (!device) return data;
  
  for (let i = hours * 60; i >= 0; i -= 5) { // Every 5 minutes
    const timestamp = new Date(now.getTime() - i * 60000);
    
    // Generate realistic medical data based on device status
    let baseFlowRate = device.currentFlowRate;
    let baseVolume = (device.totalVolume / (hours * 60)) * (hours * 60 - i);
    
    if (device.status === 'offline' || device.status === 'error') {
      baseFlowRate = i < 120 ? 0 : baseFlowRate; // Offline for last 2 hours
      baseVolume = i < 120 ? device.totalVolume * 0.8 : baseVolume;
    }
    
    // Add realistic variation
    const flowVariation = (Math.random() - 0.5) * 10;
    const volumeIncrement = Math.max(0, (baseFlowRate + flowVariation) * 5 / 60); // 5-minute increments
    
    data.push({
      timestamp: timestamp.toISOString(),
      flowRate: Math.max(0, baseFlowRate + flowVariation),
      volume: Math.max(0, baseVolume + volumeIncrement),
      pressure: Math.max(0, 15 + (Math.random() - 0.5) * 5) // Pressure in mmHg
    });
  }
  
  return data.reverse(); // Chronological order
};

// Simulate real-time updates
export const useRealtimeData = () => {
  const updateDeviceData = (deviceId: string) => {
    const device = mockDevices.find(d => d.id === deviceId);
    if (!device) return null;
    
    // Simulate real-time changes
    const variation = (Math.random() - 0.5) * 5;
    return {
      ...device,
      lastUpdate: new Date().toISOString(),
      currentFlowRate: Math.max(0, device.currentFlowRate + variation),
      totalVolume: device.totalVolume + Math.random() * 2
    };
  };
  
  return { updateDeviceData };
};