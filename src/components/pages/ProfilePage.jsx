import React, { useState } from "react";
import { ShieldCheck, KeyRound, Award, Users } from "lucide-react";

const ProfilePage = ({
  currentUser,
  onRequestRole,
  onResetPassword,
  onChangePassword,
  roleRequestStatus,
  roleRequestMessage,
  roleRequestLoading = false,
  isAdmin,
  isInstructor,
}) => {
  const profile = currentUser?.profile_meta || {};
  const canRequestRole = !isAdmin && !isInstructor;
  const [desiredRole, setDesiredRole] = useState("admin");

  const getStatusBadge = (status) => {
    if (!status) return null;
    const colors = {
      pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
      approved: "text-green-400 bg-green-400/10 border-green-400/30",
      rejected: "text-red-400 bg-red-400/10 border-red-400/30",
    };
    return (
      <span
        className={`inline-flex px-3 py-1 rounded-full text-xs font-mono border ${
          colors[status] || "text-blue-400 bg-blue-400/10 border-blue-400/30"
        }`}
      >
        ROLE_REQUEST_{status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-gray-900/70 border border-green-500/20 rounded-2xl p-8 shadow-2xl backdrop-blur">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-5xl border border-green-500/30 font-mono">
                {currentUser?.username?.charAt(0)?.toUpperCase() || "O"}
              </div>
            </div>
            <div className="flex-1 space-y-2 text-center lg:text-left">
              <p className="text-sm text-gray-500 font-mono">
                OPERATIVE_IDENTIFIER
              </p>
              <h1 className="text-4xl font-bold text-white font-mono">
                {currentUser?.full_name || currentUser?.username || "Operative"}
              </h1>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <span className="px-4 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/30 font-mono text-sm">
                  RANK_{profile.rank || "OPERATIVE"}
                </span>
                <span className="px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-mono text-sm">
                  SPECIALIZATION_{profile.specialization || "GENERAL"}
                </span>
                {getStatusBadge(roleRequestStatus)}
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 font-mono">TOTAL_POINTS</p>
              <p className="text-3xl font-bold text-green-400 font-mono">
                {currentUser?.total_points || 0}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5 text-green-400" />
                <h2 className="text-lg font-semibold text-white font-mono">
                  SECURITY_STATUS
                </h2>
              </div>
              <div className="space-y-3 text-gray-300 font-mono text-sm">
                <div className="flex justify-between">
                  <span>USERNAME</span>
                  <span className="text-white">{currentUser?.username}</span>
                </div>
                <div className="flex justify-between">
                  <span>EMAIL</span>
                  <span className="text-white">{currentUser?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>JOIN_DATE</span>
                  <span className="text-white">
                    {profile.join_date
                      ? new Date(profile.join_date).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white font-mono">
                  ACCESS_CONTROLS
                </h2>
              </div>
              <div className="space-y-4">
                {canRequestRole && (
                  <button
                    onClick={() => onRequestRole(desiredRole)}
                    disabled={roleRequestLoading || roleRequestStatus === "pending"}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold border border-blue-500/40 hover:shadow-blue-500/20 transition-all duration-300 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Users className="w-4 h-4" />
                    {roleRequestLoading ? "PROCESSING..." : `REQUEST_${desiredRole.toUpperCase()}_ROLE`}
                  </button>
                )}
                {canRequestRole && (
                  <div className="flex gap-3 text-xs font-mono text-gray-400 justify-center">
                    {["admin", "instructor"].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setDesiredRole(role)}
                        className={`px-3 py-1 rounded border ${
                          desiredRole === role
                            ? "border-blue-500/60 text-blue-300 bg-blue-500/10"
                            : "border-gray-600 text-gray-400 hover:text-white"
                        }`}
                      >
                        {role.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
                {roleRequestMessage && (
                  <p className="text-xs text-center text-gray-400 font-mono">
                    {roleRequestMessage}
                  </p>
                )}
                <button
                  onClick={onChangePassword}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white py-3 rounded-lg font-semibold border border-gray-600 hover:shadow-lg transition-all duration-300 font-mono"
                >
                  <KeyRound className="w-4 h-4" />
                  CHANGE_PASSWORD
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

