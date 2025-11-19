import React from "react";
import { Shield, Users, Database, Activity } from "lucide-react";

const AdminDashboardPage = ({
  pendingRoleRequests = [],
  overviewStats = {},
}) => {
  const pendingRequests = pendingRoleRequests.length;

  const stats = [
    {
      label: "TOTAL_USERS",
      value: overviewStats?.total_users ?? 0,
      icon: Users,
      gradient: "from-green-600 to-green-700",
    },
    {
      label: "TOTAL_LABS",
      value: overviewStats?.total_labs ?? 0,
      icon: Database,
      gradient: "from-blue-600 to-blue-700",
    },
    {
      label: "PENDING_ROLE_REQUESTS",
      value: overviewStats?.pending_role_requests ?? pendingRequests,
      icon: Shield,
      gradient: "from-purple-600 to-purple-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-10 text-center">
          <p className="text-sm text-gray-500 font-mono">
            ADMINISTRATIVE_CONTROL
          </p>
          <h1 className="text-4xl font-bold text-white font-mono mt-2">
            ADMIN_DASHBOARD
          </h1>
          <p className="text-gray-400 font-mono text-sm">
            SYSTEM_OVERVIEW_AND_ROLE_GOVERNANCE
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-gray-900/70 border border-gray-700 rounded-2xl p-6 shadow-xl"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 border border-white/20`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-gray-500 font-mono">{stat.label}</p>
                <p className="text-3xl font-bold text-white font-mono">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5 text-green-400" />
            <h2 className="text-2xl font-bold text-white font-mono">
              ROLE_REQUEST_INTEL
            </h2>
          </div>

          {pendingRequests === 0 ? (
            <div className="text-center py-10 text-gray-500 font-mono">
              NO_ACTIVE_ROLE_REQUESTS
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRoleRequests.map((request) => (
                <div
                  key={request.request_id || request.id}
                  className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <p className="text-white font-mono font-semibold">
                      {request.username}
                    </p>
                    <p className="text-gray-400 text-sm font-mono">
                      REQUESTED_ROLE: {(request.requested_role || request.role)?.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">
                      STATUS: {request.status?.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/30 font-mono text-sm opacity-60 cursor-not-allowed">
                      APPROVE
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 font-mono text-sm opacity-60 cursor-not-allowed">
                      REJECT
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

