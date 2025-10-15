// frontend/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Activity,
  Package,
  Eye,
  MoreVertical
} from 'lucide-react';

// Stat Card Component
const StatCard = ({ title, value, change, icon: Icon, trend, color }) => {
  const isPositive = trend === 'up';
  
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <div className={`flex items-center text-sm font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? (
            <ArrowUpRight className="w-4 h-4 mr-1" />
          ) : (
            <ArrowDownRight className="w-4 h-4 mr-1" />
          )}
          {change}
        </div>
      </div>
    </div>
  );
};

// Recent Activity Item
const ActivityItem = ({ title, description, time, status }) => {
  const statusColors = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    error: 'bg-red-100 text-red-800'
  };

  return (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
        {status}
      </span>
    </div>
  );
};

// Top Product Item
const ProductItem = ({ name, sales, revenue, trend }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-gray-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{sales} sales</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-900">{revenue}</p>
        <p className={`text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </p>
      </div>
    </div>
  );
};

// Quick Action Button
const QuickAction = ({ icon: Icon, label, onClick, color }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed ${color} hover:border-solid transition-all`}
    >
      <Icon className="w-8 h-8 mb-2" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

const Dashboard = () => {
  const [stats] = useState([
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Orders',
      value: '1,429',
      change: '+12.5%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-green-500'
    },
    {
      title: 'Active Users',
      value: '2,345',
      change: '+8.3%',
      trend: 'up',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '-2.4%',
      trend: 'down',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ]);

  const [activities] = useState([
    {
      title: 'New order received',
      description: 'Order #1234 from John Doe',
      time: '5 minutes ago',
      status: 'success'
    },
    {
      title: 'Payment processed',
      description: 'Payment of $299.00 confirmed',
      time: '15 minutes ago',
      status: 'info'
    },
    {
      title: 'Low stock alert',
      description: 'Product "Widget Pro" is running low',
      time: '1 hour ago',
      status: 'warning'
    },
    {
      title: 'Order cancelled',
      description: 'Order #1230 cancelled by customer',
      time: '2 hours ago',
      status: 'error'
    }
  ]);

  const [topProducts] = useState([
    { name: 'Premium Widget', sales: 142, revenue: '$4,260', trend: 12.5 },
    { name: 'Pro Dashboard', sales: 98, revenue: '$2,940', trend: 8.3 },
    { name: 'Essential Pack', sales: 76, revenue: '$1,520', trend: -3.2 },
    { name: 'Starter Kit', sales: 64, revenue: '$960', trend: 5.7 }
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Download Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            {activities.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-gray-500" />
                <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
              </div>
            </div>
          </div>
          <div className="p-6">
            {topProducts.map((product, index) => (
              <ProductItem key={index} {...product} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <QuickAction
            icon={ShoppingCart}
            label="New Order"
            color="border-blue-300 text-blue-600 hover:bg-blue-50"
          />
          <QuickAction
            icon={Package}
            label="Add Product"
            color="border-green-300 text-green-600 hover:bg-green-50"
          />
          <QuickAction
            icon={Users}
            label="Add User"
            color="border-purple-300 text-purple-600 hover:bg-purple-50"
          />
          <QuickAction
            icon={Eye}
            label="View Reports"
            color="border-orange-300 text-orange-600 hover:bg-orange-50"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;