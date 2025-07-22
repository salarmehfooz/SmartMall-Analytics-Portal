import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTelcoTrends, createTelcoTrend } from "../redux/telcoTrendSlice";
import { Link } from "react-router-dom";

export default function AdminTelcoTrendsPage() {
  const dispatch = useDispatch();
  const { trends, loading, error, createLoading, createError } = useSelector(
    (state) => state.telcoTrends
  );

  const [category, setCategory] = useState("");
  const [trendScore, setTrendScore] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    dispatch(fetchTelcoTrends());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category.trim() || trendScore === "") {
      alert("Please fill all fields");
      return;
    }

    const res = await dispatch(
      createTelcoTrend({
        category: category.trim(),
        trendScore: Number(trendScore),
      })
    );

    if (res.meta.requestStatus === "fulfilled") {
      setCategory("");
      setTrendScore("");
      setSuccessMsg("Trend added successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const isSubmitDisabled =
    createLoading || !category.trim() || trendScore === "";

  return (
    <div className="container mt-4">
      <h3>Telco Trends</h3>

      {/* Create Trend Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <input
            id="category"
            type="text"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category"
            disabled={createLoading}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="trendScore" className="form-label">
            Trend Score
          </label>
          <input
            id="trendScore"
            type="number"
            className="form-control"
            value={trendScore}
            onChange={(e) => setTrendScore(e.target.value)}
            placeholder="Enter trend score"
            disabled={createLoading}
            required
            min={0}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitDisabled}
        >
          {createLoading ? "Saving..." : "Add Trend"}
        </button>

        {createError && (
          <p className="text-danger mt-2">Error: {createError}</p>
        )}
        {successMsg && <p className="text-success mt-2">{successMsg}</p>}
      </form>

      {/* Display Existing Trends */}
      {loading && <p>Loading telco trends...</p>}
      {error && <p className="text-danger">Error: {error}</p>}

      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Category</th>
            <th>Trend Score</th>
            <th>Recorded At</th>
          </tr>
        </thead>
        <tbody>
          {trends.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">
                No telco trends data available.
              </td>
            </tr>
          ) : (
            trends.map((trend) => (
              <tr key={trend._id}>
                <td>{trend.category}</td>
                <td>{trend.trendScore}</td>
                <td>{new Date(trend.recordedAt).toLocaleString()}</td>
              </tr>
            ))
          )}
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
