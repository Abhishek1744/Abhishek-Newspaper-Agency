import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { Users, FileText, DollarSign, TrendingUp, Newspaper } from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome to your newspaper billing dashboard</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Customers"
            value="1,234"
            icon={<Users className="h-6 w-6" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Active Subscriptions"
            value="1,089"
            icon={<Newspaper className="h-6 w-6" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Monthly Revenue"
            value="$12,345"
            icon={<DollarSign className="h-6 w-6" />}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Pending Invoices"
            value="45"
            icon={<FileText className="h-6 w-6" />}
            trend={{ value: 2, isPositive: false }}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Placeholder for future charts/tables */}
          <div className="bg-white p-6 rounded-lg shadow-sm min-h-[400px]">
            <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
            {/* Add chart here later */}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm min-h-[400px]">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            {/* Add activity feed here later */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;