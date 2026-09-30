import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

function CitizenDashboard() {
  const [applications, setApplications] = useState([]);
  const [consents, setConsents] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    
    try {
      const appRes = await axios.get('http://localhost:5000/api/applications', { headers });
      setApplications(appRes.data);

      const conRes = await axios.get('http://localhost:5000/api/consents', { headers });
      setConsents(conRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConsent = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/consents/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchData(); // refresh

      // Mock trigger for Department 2 to resume processing if approved
      if (status === 'approved') {
        const consent = consents.find(c => c._id === id);
        // Find the pending application waiting for this consent
        const app = applications.find(a => a.status === 'Pending Consent' && a.primaryDepartment === consent.requestingDepartment);
        if (app) {
           await axios.post(`http://localhost:5000/api/dept2/process/${app._id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
           fetchData();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Citizen Dashboard</h1>
        <Link to="/citizen/apply" className="bg-blue-600 text-white px-4 py-2 rounded">Apply for Service</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Pending Consents</h2>
          {consents.filter(c => c.status === 'pending').length === 0 ? (
            <p className="text-gray-500">No pending consents.</p>
          ) : (
            consents.filter(c => c.status === 'pending').map(c => (
              <div key={c._id} className="border p-3 rounded mb-2 bg-yellow-50">
                <p><strong>{c.requestingDepartment}</strong> is requesting data from <strong>{c.providingDepartment}</strong></p>
                <p className="text-sm text-gray-600">Data requested: {c.dataRequested.join(', ')}</p>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => handleConsent(c._id, 'approved')} className="bg-green-500 text-white px-3 py-1 rounded flex items-center gap-1"><CheckCircle size={16}/> Approve</button>
                  <button onClick={() => handleConsent(c._id, 'rejected')} className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1"><XCircle size={16}/> Reject</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">My Applications</h2>
          {applications.length === 0 ? (
            <p className="text-gray-500">No applications found.</p>
          ) : (
            applications.map(app => (
              <div key={app._id} className="border p-3 rounded mb-2">
                <div className="flex justify-between font-bold">
                  <span>{app.serviceName}</span>
                  <span className={`text-sm ${app.status === 'Approved' ? 'text-green-600' : 'text-orange-600'}`}>{app.status}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">Tracking ID: {app.trackingId}</p>
                
                <div className="pl-4 border-l-2 border-blue-200 space-y-2 mt-2">
                  {app.timeline.map((t, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-5 top-1 bg-blue-500 w-2 h-2 rounded-full"></div>
                      <p className="text-sm"><strong>{t.department}</strong>: {t.status}</p>
                      <p className="text-xs text-gray-500">{t.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CitizenDashboard;
