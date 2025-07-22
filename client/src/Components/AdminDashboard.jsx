import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { fetchStores } from "../redux/storeSlice";
import { fetchWalkInLogs } from "../redux/walkInLogSlice";
import { fetchTelcoTrends } from "../redux/telcoTrendSlice";
import { fetchRecommendations } from "../redux/recommendationSlice";

export default function AdminDashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const {
    stores,
    loading: storesLoading,
    error: storesError,
  } = useSelector((state) => state.stores || {});

  const {
    logs: walkInLogs,
    loading: logsLoading,
    error: logsError,
  } = useSelector((state) => state.walkInLogs || {});

  const {
    trends,
    loading: telcoLoading,
    error: telcoError,
  } = useSelector((state) => state.telcoTrends || {});

  const {
    recommendations,
    loading: recLoading,
    error: recError,
  } = useSelector((state) => state.recommendations || {});

  useEffect(() => {
    dispatch(fetchStores());
    dispatch(fetchWalkInLogs());
    dispatch(fetchTelcoTrends());
    dispatch(fetchRecommendations());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome, {user?.name || "Admin"}</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Stores</h5>
              {storesLoading ? (
                <p>Loading...</p>
              ) : storesError ? (
                <p className="text-danger">{storesError}</p>
              ) : (
                <p className="card-text fs-3">{stores?.length ?? 0}</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-secondary mb-3">
            <div className="card-body">
              <h5 className="card-title">Walk-in Logs</h5>
              {logsLoading ? (
                <p>Loading...</p>
              ) : logsError ? (
                <p className="text-danger">{logsError}</p>
              ) : (
                <p className="card-text fs-3">{walkInLogs?.length ?? 0}</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-info mb-3">
            <div className="card-body">
              <h5 className="card-title">Telco Trends</h5>
              {telcoLoading ? (
                <p>Loading...</p>
              ) : telcoError ? (
                <p className="text-danger">{telcoError}</p>
              ) : (
                <p className="card-text fs-3">{trends?.length ?? 0}</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Recommendations</h5>
              {recLoading ? (
                <p>Loading...</p>
              ) : recError ? (
                <p className="text-danger">{recError}</p>
              ) : (
                <p className="card-text fs-3">{recommendations?.length ?? 0}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="row">
        <div className="col-md-3 mb-3">
          <Link to="/admin/stores" className="btn btn-primary w-100 p-4">
            Manage Stores
          </Link>
        </div>
        <div className="col-md-3 mb-3">
          <Link to="/admin/walkins" className="btn btn-secondary w-100 p-4">
            Walk-in Logs
          </Link>
        </div>
        <div className="col-md-3 mb-3">
          <Link
            to="/admin/telcotrends"
            className="btn btn-info w-100 p-4 text-white"
          >
            Telco Trends
          </Link>
        </div>
        <div className="col-md-3 mb-3">
          <Link
            to="/admin/recommendations"
            className="btn btn-success w-100 p-4"
          >
            Recommendations
          </Link>
        </div>
        <div className="col-md-3 mb-3">
          <Link
            to="/admin/register-storemanager"
            className="btn btn-warning w-100 p-4 text-white"
          >
            Register Store Manager
          </Link>
        </div>
      </div>
    </div>
  );
}
