import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWalkInLogs } from "../redux/walkInLogSlice";
import { Link } from "react-router-dom";

export default function AdminWalkInsPage() {
  const dispatch = useDispatch();

  const {
    logs: walkInLogs,
    loading,
    error,
  } = useSelector((state) => state.walkInLogs);

  useEffect(() => {
    dispatch(fetchWalkInLogs());
  }, [dispatch]);

  return (
    <div className="container mt-4">
      <h3>Walk-in Logs</h3>

      {loading && <p>Loading walk-in logs...</p>}
      {error && <p className="text-danger">Error: {error}</p>}

      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Store</th>
            <th>Timestamp</th>
            <th>Estimated Customer Count</th>
          </tr>
        </thead>
        <tbody>
          {walkInLogs.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">
                No walk-in logs available.
              </td>
            </tr>
          )}

          {walkInLogs.map((log) => (
            <tr key={log._id}>
              <td>{log.store?.name || "N/A"}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.estimatedCustomerCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="col-md-3 mb-3">
        <Link to="/admin/*" className="btn btn-success w-100 p-4">
          Back To Dashboard
        </Link>
      </div>
    </div>
  );
}
