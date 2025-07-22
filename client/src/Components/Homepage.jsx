import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 text-center shadow" style={{ width: "350px" }}>
        <h2 className="mb-3">Welcome to SMART STORE APP</h2>

        <button
          className="btn btn-primary mb-3"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default HomePage;
