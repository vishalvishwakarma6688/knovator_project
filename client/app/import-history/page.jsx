"use client";

import { useEffect, useState } from "react";

export default function ImportHistoryPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    setIsClient(true); // 👈 Mark that we're on the client

    async function fetchLogs() {
      try {
        const res = await fetch("https://knovator-backend-8zd9.onrender.com/");
        const data = await res.json();
        console.log("Fetched data ", data);
        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  const handleRetry = (fail) => {
    console.log("🔁 Retry clicked for job:", fail.jobData);
  };

  if (!isClient) return null; // 👈 Avoid server render

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">📝 Import History</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Timestamp</th>
                <th className="border p-2">Source</th>
                <th className="border p-2">Fetched</th>
                <th className="border p-2">Imported</th>
                <th className="border p-2">New</th>
                <th className="border p-2">Updated</th>
                <th className="border p-2">Failed</th>
                <th className="border p-2">Reason</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td className="border p-2">
                    {new Date(log.timeStamp).toLocaleString()}
                  </td>
                  <td className="border p-2">{log.sourceUrl}</td>
                  <td className="border p-2 text-center">{log.totalFetched}</td>
                  <td className="border p-2 text-center">
                    {log.totalImported}
                  </td>
                  <td className="border p-2 text-center">{log.newJobs}</td>
                  <td className="border p-2 text-center">{log.updatedJobs}</td>
                  <td className="border p-2 text-center">
                    {log.failedJobs?.length || 0}
                  </td>
                  <td className="border p-2 text-center">
                    {" "}
                    {log.failedJobs.length > 0 ? (
                      <button
                        className="text-red-500 cursor-pointer underline"
                        onClick={() => setSelectedLog(log)}
                      >
                        {" "}
                        View ({log.failedJobs.length}){" "}
                      </button>
                    ) : (
                      "0"
                    )}{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity duration-300 ease-out"
            onClick={() => setSelectedLog(null)}
          ></div>
          <div className="relative z-10 w-full max-w-md p-6 bg-white rounded-xl shadow-xl transform transition-all duration-300 ease-out scale-100 opacity-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-red-600">
                ❌ Failed Reasons
              </h2>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer transition"
              >
                ✖
              </button>
            </div>
            <ul className="space-y-3 max-h-[300px] overflow-y-auto text-sm text-red-700">
              {selectedLog.failedJobs.map((fail, idx) => (
                <li
                  key={idx}
                  className="bg-red-50 border border-red-200 rounded p-3"
                >
                  {fail.reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
