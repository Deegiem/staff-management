// src/app/debug/page.tsx - Temporary debug page
'use client';
import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [staffData, setStaffData] = useState<any>(null);

  useEffect(() => {
    // Test basic API connectivity
    fetch('/api/staff/test')
      .then(res => res.json())
      .then(setApiStatus)
      .catch(err => setApiStatus({ error: err.message }));

    // Test staff API
    fetch('/api/staff?limit=5')
      .then(res => res.json())
      .then(setStaffData)
      .catch(err => setStaffData({ error: err.message }));
  }, []);

  return (
    <div className="container text-black mx-auto p-6">
      <h1 className="text-2xl text-white font-bold mb-6">Debug Information</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">API Status</h2>
          <pre>{JSON.stringify(apiStatus, null, 2)}</pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Staff API Response</h2>
          <pre>{JSON.stringify(staffData, null, 2)}</pre>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Cookies</h2>
          <pre>{document.cookie || 'No cookies'}</pre>
        </div>
      </div>
    </div>
  );
}