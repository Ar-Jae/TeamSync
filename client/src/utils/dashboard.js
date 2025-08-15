import { useState, useEffect } from 'react';
import { getAuthToken } from './auth';

export default function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({ tasks: 0, documents: 0, recent: [] });

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const token = getAuthToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [tasksRes, docsRes] = await Promise.all([
          fetch('/api/tasks', { headers }),
          fetch('/api/documents', { headers }),
        ]);

        if (!tasksRes.ok) throw new Error('Failed to load tasks');
        if (!docsRes.ok) throw new Error('Failed to load documents');

        const tasks = await tasksRes.json();
        const docs = await docsRes.json();

        if (!cancelled) {
          setSummary({ tasks: Array.isArray(tasks) ? tasks.length : 0, documents: Array.isArray(docs) ? docs.length : 0, recent: Array.isArray(docs) ? docs.slice(0, 5) : [] });
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true };
  }, []);

  return { loading, error, summary };
}
