import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/mockApi';

function ApplyService() {
  const [service, setService] = useState('DrivingLicense');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    // Hardcoded logic for demo purposes
    // Driving License (Transport Dept) requires Income/ID data from Revenue Dept
    const payload = {
      serviceName: "Driving License",
      primaryDepartment: "Education", // Let's use Education based on our backend dept2 logic
      formData: {
        applicationType: "Fresh"
      },
      requiresDataFrom: "Revenue"
    };

    if (service === 'Scholarship') {
       payload.serviceName = "Scholarship Scheme";
       payload.primaryDepartment = "Education";
       payload.requiresDataFrom = "Revenue";
    }

    try {
      await api.applications.create(payload, token);
      navigate('/citizen/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to apply');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow rounded">
      <h1 className="text-2xl font-bold mb-4 border-b pb-2">Apply for a Service</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">Select Service</label>
          <select value={service} onChange={e => setService(e.target.value)} className="w-full border p-2 rounded">
            <option value="Scholarship">Scholarship Scheme (Education Dept)</option>
            <option value="DrivingLicense">Driving License (Transport Dept)</option>
          </select>
        </div>
        <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
          <p><strong>Note:</strong> This service requires fetching verified income data from the Revenue Department. A consent request will be generated.</p>
        </div>
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Submit Application</button>
      </form>
    </div>
  );
}

export default ApplyService;
