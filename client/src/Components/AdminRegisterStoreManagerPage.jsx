import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function AdminRegisterStoreManagerPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeId, setStoreId] = useState("");
  const [stores, setStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    async function fetchStores() {
      setLoadingStores(true);
      try {
        const res = await fetch("http://localhost:3000/api/stores", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load stores");
        const data = await res.json();
        setStores(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingStores(false);
      }
    }
    fetchStores();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!name || !email || !password || !storeId) {
      setError("Please fill all required fields");
      return;
    }

    setLoadingSubmit(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          password,
          storeId, // ✅ Corrected key
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to register store manager");
      }

      setSuccessMsg("Store Manager registered successfully!");
      setName("");
      setEmail("");
      setPassword("");
      setStoreId("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Register New Store Manager</h2>

      {error && <p className="text-danger">{error}</p>}
      {successMsg && <p className="text-success">{successMsg}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name *</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loadingSubmit}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email *</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loadingSubmit}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password *</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loadingSubmit}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Assign Store *</label>
          {loadingStores ? (
            <p>Loading stores...</p>
          ) : (
            <select
              className="form-select"
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              disabled={loadingSubmit}
            >
              <option value="">Select a store</option>
              {stores.map((store) => (
                <option key={store._id} value={store._id}>
                  {store.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loadingSubmit || loadingStores}
        >
          {loadingSubmit ? "Registering..." : "Register Store Manager"}
        </button>
      </form>
      <div className="col-md-3 mb-3">
        <Link to="/admin/*" className="btn btn-success w-100 p-4">
          Back To Dashboard
        </Link>
      </div>
    </div>
  );
}
