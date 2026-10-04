// src/utils/mockApi.js

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const getDB = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setDB = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const generateId = () => Math.random().toString(36).substr(2, 9);

export const api = {
  auth: {
    register: async (data) => {
      await delay();
      const users = getDB('users');
      if (users.find(u => u.email === data.email)) throw new Error('User already exists');
      const newUser = { id: generateId(), ...data };
      users.push(newUser);
      setDB('users', users);
      return { token: newUser.id, user: newUser };
    },
    login: async (email, password) => {
      await delay();
      const users = getDB('users');
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) throw new Error('Invalid Credentials');
      return { token: user.id, user };
    }
  },
  applications: {
    get: async (userId, role) => {
      await delay();
      const apps = getDB('applications');
      if (role === 'official') return apps;
      return apps.filter(a => a.citizenId === userId);
    },
    create: async (data, userId) => {
      await delay();
      const apps = getDB('applications');
      const newApp = {
        _id: generateId(),
        citizenId: userId,
        serviceName: data.serviceName,
        primaryDepartment: data.primaryDepartment,
        trackingId: Math.floor(Math.random() * 1000000).toString(),
        status: data.requiresDataFrom ? 'Pending Consent' : 'Submitted',
        timeline: [{ status: 'Submitted', department: data.primaryDepartment, notes: 'Application received.' }],
        createdAt: new Date().toISOString()
      };
      
      if (data.requiresDataFrom) {
        const consents = getDB('consents');
        const newConsent = {
          _id: generateId(),
          citizenId: userId,
          requestingDepartment: data.primaryDepartment,
          providingDepartment: data.requiresDataFrom,
          dataRequested: ["IdentityDetails", "IncomeDetails"],
          status: 'pending'
        };
        consents.push(newConsent);
        setDB('consents', consents);

        newApp.timeline.push({
          status: 'Pending Consent',
          department: data.primaryDepartment,
          notes: `Awaiting citizen consent to fetch data from ${data.requiresDataFrom}`
        });

        // Log audit
        const logs = getDB('auditLogs');
        logs.push({
          _id: generateId(),
          action: 'CONSENT_REQUESTED',
          actor: data.primaryDepartment,
          resource: newConsent._id,
          timestamp: new Date().toISOString()
        });
        setDB('auditLogs', logs);
      }
      
      apps.push(newApp);
      setDB('applications', apps);

      // Log audit
      const logs = getDB('auditLogs');
      logs.push({
        _id: generateId(),
        action: 'APPLICATION_SUBMITTED',
        actor: userId,
        resource: newApp._id,
        timestamp: new Date().toISOString()
      });
      setDB('auditLogs', logs);

      return newApp;
    }
  },
  consents: {
    get: async (userId) => {
      await delay();
      const consents = getDB('consents');
      return consents.filter(c => c.citizenId === userId);
    },
    update: async (id, status, userId) => {
      await delay();
      const consents = getDB('consents');
      const consentIndex = consents.findIndex(c => c._id === id && c.citizenId === userId);
      if (consentIndex === -1) throw new Error('Not found');
      
      consents[consentIndex].status = status;
      setDB('consents', consents);

      // Log audit
      const logs = getDB('auditLogs');
      logs.push({
        _id: generateId(),
        action: `CONSENT_${status.toUpperCase()}`,
        actor: userId,
        resource: id,
        timestamp: new Date().toISOString()
      });
      setDB('auditLogs', logs);

      return consents[consentIndex];
    }
  },
  dept2: {
    process: async (applicationId) => {
      await delay();
      const apps = getDB('applications');
      const appIndex = apps.findIndex(a => a._id === applicationId);
      if (appIndex === -1) return;

      const app = apps[appIndex];
      
      // Simulate data fetch and processing
      const newStatus = "Approved"; // We'll just hardcode approval for demo
      app.status = newStatus;
      app.timeline.push({
        status: newStatus,
        department: "Education",
        notes: "Data fetched from Revenue Dept. Income Verified: true."
      });

      setDB('applications', apps);

      // Log audit
      const logs = getDB('auditLogs');
      logs.push({
        _id: generateId(),
        action: 'APPLICATION_PROCESSED',
        actor: 'Education',
        resource: applicationId,
        timestamp: new Date().toISOString()
      });
      setDB('auditLogs', logs);
    }
  },
  audit: {
    get: async () => {
      await delay();
      return getDB('auditLogs');
    }
  }
};
