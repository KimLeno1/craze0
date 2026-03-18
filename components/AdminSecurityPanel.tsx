
import React, { useState, useEffect } from 'react';

interface SecurityEvent {
  id: string;
  type: 'LOGIN' | 'LOGOUT' | 'UNAUTHORIZED_ACCESS' | 'SYSTEM_CONFIG_CHANGE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: string;
  details: string;
  ip: string;
}

const AdminSecurityPanel: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [systemStatus, setSystemStatus] = useState({
    firewall: 'ACTIVE',
    encryption: 'AES-256-GCM',
    loadBalancer: 'HEALTHY',
    activeSessions: 12,
    threatLevel: 'LOW'
  });

  useEffect(() => {
    // Generate some mock security events
    const mockEvents: SecurityEvent[] = [
      {
        id: 'evt_1',
        type: 'LOGIN',
        severity: 'LOW',
        timestamp: new Date().toISOString(),
        details: 'Admin session established: @leno',
        ip: '192.168.1.105'
      },
      {
        id: 'evt_2',
        type: 'UNAUTHORIZED_ACCESS',
        severity: 'HIGH',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        details: 'Failed login attempt on Sector_Admin: ARCHITECT_X',
        ip: '45.23.11.92'
      },
      {
        id: 'evt_3',
        type: 'SYSTEM_CONFIG_CHANGE',
        severity: 'MEDIUM',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        details: 'Price range updated for SKU: 102',
        ip: '192.168.1.105'
      },
      {
        id: 'evt_4',
        type: 'LOGIN',
        severity: 'LOW',
        timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        details: 'Supplier session established: @sup1',
        ip: '172.16.0.4'
      }
    ];
    setEvents(mockEvents);
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif italic text-white">Security_Control_Center</h2>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mt-2">Neural Firewall & System Integrity Monitoring</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">System Shield Active</span>
          </div>
        </div>
      </header>

      {/* System Health Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Neural Firewall', value: systemStatus.firewall, color: 'text-blue-500' },
          { label: 'Encryption Protocol', value: systemStatus.encryption, color: 'text-purple-500' },
          { label: 'Active Links', value: systemStatus.activeSessions, color: 'text-amber-500' },
          { label: 'Threat Level', value: systemStatus.threatLevel, color: 'text-green-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-950 border border-white/5 p-6 rounded-3xl space-y-2">
            <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{stat.label}</div>
            <div className={`text-lg font-black font-mono ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Real-time Logs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Integrity_Logs</h3>
            <button className="text-[8px] font-black text-[#EC4899] uppercase tracking-widest hover:underline">Export_Archive</button>
          </div>
          
          <div className="bg-zinc-950 border border-white/5 rounded-[2.5rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="p-6 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Timestamp</th>
                    <th className="p-6 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Event_Type</th>
                    <th className="p-6 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Severity</th>
                    <th className="p-6 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(event => (
                    <tr key={event.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-6 text-[9px] font-mono text-zinc-400">{new Date(event.timestamp).toLocaleTimeString()}</td>
                      <td className="p-6">
                        <span className="text-[9px] font-black text-white uppercase tracking-tighter">{event.type}</span>
                      </td>
                      <td className="p-6">
                        <span className={`px-2 py-1 rounded text-[7px] font-black uppercase ${
                          event.severity === 'CRITICAL' ? 'bg-red-500 text-white' :
                          event.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-500' :
                          event.severity === 'MEDIUM' ? 'bg-amber-500/20 text-amber-500' :
                          'bg-blue-500/20 text-blue-500'
                        }`}>
                          {event.severity}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="text-[10px] text-zinc-300 font-medium">{event.details}</div>
                        <div className="text-[7px] text-zinc-600 font-mono mt-1">SRC_IP: {event.ip}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Security Controls */}
        <div className="space-y-8">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">System_Directives</h3>
          
          <div className="space-y-4">
            {[
              { label: 'Lockdown Mode', desc: 'Terminate all active sessions', action: 'INITIATE', color: 'bg-red-500' },
              { label: 'Flush Cache', desc: 'Clear all temporary neural buffers', action: 'EXECUTE', color: 'bg-zinc-800' },
              { label: 'Rotate Keys', desc: 'Generate new security signatures', action: 'ROTATE', color: 'bg-zinc-800' },
              { label: 'Audit System', desc: 'Run full integrity diagnostic', action: 'SCAN', color: 'bg-[#EC4899]' },
            ].map((control, i) => (
              <div key={i} className="bg-zinc-950 border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:border-white/20 transition-all">
                <div className="space-y-1">
                  <div className="text-[10px] font-black text-white uppercase tracking-widest">{control.label}</div>
                  <div className="text-[8px] text-zinc-600 uppercase">{control.desc}</div>
                </div>
                <button className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${control.color} text-white active:scale-95`}>
                  {control.action}
                </button>
              </div>
            ))}
          </div>

          <div className="bg-zinc-950 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Network_Traffic
            </div>
            <div className="h-24 flex items-end gap-1">
              {[40, 65, 45, 80, 55, 90, 70, 40, 60, 85, 50, 75].map((h, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-blue-500/20 rounded-t-sm hover:bg-blue-500 transition-all cursor-help"
                  style={{ height: `${h}%` }}
                  title={`Traffic: ${h}mb/s`}
                />
              ))}
            </div>
            <div className="flex justify-between text-[7px] font-black text-zinc-700 uppercase">
              <span>00:00</span>
              <span>12:00</span>
              <span>23:59</span>
            </div>
          </div>

          <div className="bg-zinc-950 border border-white/5 p-8 rounded-[2.5rem] space-y-4">
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Neural_Load
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                  <span className="text-zinc-500">CPU_CORE_01</span>
                  <span className="text-white">42%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[42%] shadow-[0_0_10px_#a855f7]"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                  <span className="text-zinc-500">MEMORY_ALLOC</span>
                  <span className="text-white">68%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[68%] shadow-[0_0_10px_#a855f7]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSecurityPanel;
