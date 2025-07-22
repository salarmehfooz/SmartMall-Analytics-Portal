import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { fetchWalkInLogs } from "../redux/walkInLogSlice";
import { fetchMyCategoryTrends } from "../redux/telcoTrendSlice";

export default function StoreManagerDashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const {
    walkInLogs,
    loading: logsLoading,
    error: logsError,
  } = useSelector((state) => state.walkInLogs);

  const {
    category,
    trends,
    loading: trendsLoading,
    error: trendsError,
  } = useSelector((state) => state.telcoTrends);

  useEffect(() => {
    dispatch(fetchWalkInLogs());
    dispatch(fetchMyCategoryTrends());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome, {user?.name || "Store Manager"}</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card text-white bg-secondary mb-3">
            <div className="card-body">
              <h5 className="card-title">Walk-in Logs</h5>
              {logsLoading ? (
                <p>Loading...</p>
              ) : logsError ? (
                <p className="text-danger">{logsError}</p>
              ) : (
                <p className="card-text fs-3">
                  {Array.isArray(walkInLogs) ? walkInLogs.length : 0}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card text-white bg-info mb-3">
            <div className="card-body">
              <h5 className="card-title">
                Telco Trends for Category:{" "}
                {category || <span className="text-muted">Loading...</span>}
              </h5>
              {trendsLoading ? (
                <p>Loading...</p>
              ) : trendsError ? (
                <p className="text-danger">{trendsError}</p>
              ) : (
                <p className="card-text fs-3">
                  {Array.isArray(trends) ? trends.length : 0}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <Link
            to="/storemanager/walkins"
            className="btn btn-secondary w-100 p-4"
          >
            View Walk-in Logs
          </Link>
        </div>

        <div className="col-md-6 mb-3">
          <Link
            to="/storemanager/telcotrends"
            className="btn btn-info w-100 p-4 text-white"
          >
            View Telco Trends
          </Link>
        </div>
      </div>
    </div>
  );
}
