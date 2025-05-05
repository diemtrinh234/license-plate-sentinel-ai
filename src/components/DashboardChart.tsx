
import React from "react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface Vehicle {
  id: number;
  plate: string;
  time: string;
  date: string;
  location: string;
  type: string;
  status: "violation" | "normal";
}

interface DashboardChartProps {
  data: Vehicle[];
}

export const DashboardChart: React.FC<DashboardChartProps> = ({ data }) => {
  // Chuẩn bị dữ liệu cho biểu đồ vi phạm theo loại
  const prepareViolationTypeData = () => {
    const violationTypes: { [key: string]: number } = {};
    
    data.filter(v => v.status === "violation").forEach(vehicle => {
      if (!violationTypes[vehicle.type]) {
        violationTypes[vehicle.type] = 0;
      }
      violationTypes[vehicle.type]++;
    });
    
    return Object.entries(violationTypes).map(([name, value]) => ({ name, value }));
  };
  
  // Chuẩn bị dữ liệu cho biểu đồ vị trí có nhiều vi phạm
  const prepareLocationData = () => {
    const locationCounts: { [key: string]: { total: number, violations: number } } = {};
    
    data.forEach(vehicle => {
      if (!locationCounts[vehicle.location]) {
        locationCounts[vehicle.location] = { total: 0, violations: 0 };
      }
      
      locationCounts[vehicle.location].total++;
      
      if (vehicle.status === "violation") {
        locationCounts[vehicle.location].violations++;
      }
    });
    
    return Object.entries(locationCounts)
      .map(([name, counts]) => ({ 
        name, 
        total: counts.total,
        violations: counts.violations 
      }))
      .sort((a, b) => b.violations - a.violations)
      .slice(0, 5);
  };
  
  // Chuẩn bị dữ liệu cho biểu đồ theo giờ
  const prepareHourlyData = () => {
    const hours: { [key: string]: { total: number, violations: number } } = {};
    
    // Khởi tạo tất cả các giờ trong ngày
    for (let i = 0; i < 24; i++) {
      const hourString = i.toString().padStart(2, '0');
      hours[hourString] = { total: 0, violations: 0 };
    }
    
    data.forEach(vehicle => {
      const hour = vehicle.time.split(':')[0].padStart(2, '0');
      
      if (!hours[hour]) {
        hours[hour] = { total: 0, violations: 0 };
      }
      
      hours[hour].total++;
      
      if (vehicle.status === "violation") {
        hours[hour].violations++;
      }
    });
    
    return Object.entries(hours).map(([hour, counts]) => ({
      hour,
      total: counts.total,
      violations: counts.violations
    }));
  };
  
  const violationTypeData = prepareViolationTypeData();
  const locationData = prepareLocationData();
  const hourlyData = prepareHourlyData();
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-secondary/30 rounded-lg p-4 border border-border">
          <h4 className="font-medium mb-4">Vi phạm theo loại</h4>
          <ChartContainer className="h-80" config={{ color: { color: "#10b981" } }}>
            <PieChart>
              <Pie
                data={violationTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {violationTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ChartContainer>
        </div>
        
        <div className="bg-secondary/30 rounded-lg p-4 border border-border">
          <h4 className="font-medium mb-4">Top 5 vị trí có nhiều vi phạm</h4>
          <ChartContainer className="h-80" config={{ color: { color: "#10b981" } }}>
            <BarChart data={locationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={false} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="violations" fill="#FF8042" name="Vi phạm" />
              <Bar dataKey="total" fill="#0088FE" name="Tổng số" />
            </BarChart>
          </ChartContainer>
          <ChartLegend>
            <ChartLegendContent />
          </ChartLegend>
        </div>
      </div>
      
      <div className="bg-secondary/30 rounded-lg p-4 border border-border">
        <h4 className="font-medium mb-4">Phân bố vi phạm theo giờ trong ngày</h4>
        <ChartContainer className="h-80" config={{ color: { color: "#10b981" } }}>
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="violations" stroke="#FF8042" name="Vi phạm" />
            <Line type="monotone" dataKey="total" stroke="#0088FE" name="Tổng số" />
          </LineChart>
        </ChartContainer>
        <ChartLegend>
          <ChartLegendContent />
        </ChartLegend>
      </div>
    </div>
  );
};
