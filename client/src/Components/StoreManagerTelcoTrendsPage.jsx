import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyCategoryTrends } from "../redux/telcoTrendSlice";
import { Link } from "react-router-dom";


export default function StoreManagerTelcoTrendsPage() {
  const dispatch = useDispatch();

  const { category, trends, loading, error } = useSelector(
    (state) => state.telcoTrends
  );

  useEffect(() => {
    dispatch(fetchMyCategoryTrends());
  }, [dispatch]);

  return (
    <div className="container mt-4">
      <h3>Telco Trends for Category: {category || "Loading..."}</h3>

      {loading && <p>Loading trends...</p>}
      {error && <p className="text-danger">Error: {error}</p>}

      {!loading && !error && trends.length === 0 && (
        <p>No trends available for this category.</p>
      )}

      {!loading && trends.length > 0 && (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Category</th>
              <th>Trend Score</th>
              <th>Recorded At</th>
            </tr>
          </thead>
          <tbody>
            {trends.map((trend) => (
              <tr key={trend._id}>
                <td>{trend.category}</td>
                <td>{trend.trendScore}</td>
                <td>{new Date(trend.recordedAt).toLocaleString()}</td>
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
