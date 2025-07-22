import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWalkInLogs, addWalkInLog } from "../redux/walkInLogSlice";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function StoreManagerWalkInLogsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const {
    logs: walkInLogs,
    loading,
    error,
  } = useSelector((state) => state.walkInLogs);

  const [estimatedCustomerCount, setEstimatedCustomerCount] = useState("");
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchWalkInLogs());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleAddLog = async (e) => {
    e.preventDefault();

    const count = Number(estimatedCustomerCount);
    if (!count || count <= 0) {
      setFormError("Please enter a valid number of customers.");
      return;
    }

    setFormError(null);
    setFormLoading(true);

    try {
      await dispatch(
        addWalkInLog({
          estimatedCustomerCount: count,
        })
      ).unwrap();

      setEstimatedCustomerCount("");
    } catch (err) {
      setFormError(err || "Failed to add walk-in log");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{user?.name || "Store Manager"}'s Walk-in Logs</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-header">Add New Walk-in Log</div>
        <div className="card-body">
          {formError && <p className="text-danger">{formError}</p>}
          <form onSubmit={handleAddLog}>
            <div className="mb-3">
              <label className="form-label">Number of Customers *</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={estimatedCustomerCount}
                onChange={(e) => setEstimatedCustomerCount(e.target.value)}
                disabled={formLoading}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formLoading}
            >
              {formLoading ? "Adding..." : "Add Walk-in Log"}
            </button>
          </form>
        </div>
      </div>

      {loading && <p>Loading walk-in logs...</p>}
      {error && <p className="text-danger">Error: {error}</p>}

      {!loading && !error && walkInLogs.length === 0 && (
        <p>No walk-in logs available for your store.</p>
      )}

      {!loading && walkInLogs.length > 0 && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Number of Customers</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {walkInLogs.map((log) => (
              <tr key={log._id}>
                <td>{log.estimatedCustomerCount}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="col-md-6 mb-3">
        <Link
          to="/store-manager/*"
          className="btn btn-info w-100 p-4 text-white"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
