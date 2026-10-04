import { useState, useEffect } from 'react';
import { api } from '../utils/mockApi';

function OfficialDashboard() {
  const [logs, setLogs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const logData = await api.audit.get();
      setLogs(logData.reverse()); // latest first

      const appData = await api.applications.get(token, 'official');
      setApplications(appData.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Official Dashboard (System Monitor)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Global Applications</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Tracking ID</th>
                  <th className="p-2">Service</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app._id} className="border-b">
                    <td className="p-2 font-mono text-xs">{app.trackingId}</td>
                    <td className="p-2">{app.serviceName}</td>
                    <td className="p-2">
                       <span className={`px-2 py-1 rounded text-xs ${app.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                         {app.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">System Audit Logs</h2>
          <div className="space-y-2 h-[400px] overflow-y-auto">
            {logs.map(log => (
              <div key={log._id} className="p-2 bg-gray-50 border rounded text-sm font-mono">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                  <span>Actor: {log.actor}</span>
                </div>
                <div className="font-bold text-blue-800">{log.action}</div>
                <div className="text-gray-700 mt-1">Resource: {log.resource}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OfficialDashboard;
