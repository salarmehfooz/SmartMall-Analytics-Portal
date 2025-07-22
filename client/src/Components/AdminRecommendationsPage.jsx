import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecommendations } from "../redux/recommendationSlice";

export default function AdminRecommendationsPage() {
  const dispatch = useDispatch();

  const { recommendations, loading, error } = useSelector(
    (state) => state.recommendations
  );

  useEffect(() => {
    dispatch(fetchRecommendations());
  }, [dispatch]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Product Promotion Recommendations</h3>
        <button
          className="btn btn-outline-primary"
          onClick={() => dispatch(fetchRecommendations())}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <p className="text-danger">Error: {error}</p>}

      {!loading && recommendations.length === 0 && (
        <p>No recommendations available currently.</p>
      )}

      <ul className="list-group mt-3">
        {recommendations.map((rec, index) => (
          <li key={index} className="list-group-item">
            <div>
              <strong>Store:</strong> {rec.store || "N/A"} (Floor: {rec.floor},
              Category: {rec.category})
            </div>
            {rec.suggestions.map((reason, i) => (
              <div key={i}>
                <strong>Reason:</strong> {reason}
              </div>
            ))}
          </li>
        ))}
      </ul>

      <div className="col-md-3 mb-3">
        <Link to="/admin/*" className="btn btn-success w-100 p-4">
          Back To Dashboard
        </Link>
      </div>
    </div>
  );
}
