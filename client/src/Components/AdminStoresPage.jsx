import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStores,
  deleteStore,
  updateStore,
  createStore,
} from "../redux/storeSlice";

export default function AdminStoresPage() {
  const dispatch = useDispatch();
  const { stores, loading, error } = useSelector((state) => state.stores);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: "",
    category: "",
    floor: "",
  });

  
  const [editingStore, setEditingStore] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    category: "",
    floor: "",
  });

  // Fetch stores on mount
  useEffect(() => {
    dispatch(fetchStores());
  }, [dispatch]);

  // --- CREATE STORE HANDLERS ---

  const openCreateModal = () => setShowCreateModal(true);
  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateFormData({ name: "", category: "", floor: "" });
  };

  const handleCreateChange = (e) => {
    setCreateFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    dispatch(createStore(createFormData))
      .unwrap()
      .then(() => {
        closeCreateModal();
      })
      .catch((err) => {
        alert("Failed to create store: " + err);
      });
  };

  // --- EDIT STORE HANDLERS ---

  const openEditModal = (store) => {
    setEditingStore(store);
    setEditFormData({
      name: store.name || "",
      category: store.category || "",
      floor: store.floor || "",
    });
  };

  const closeEditModal = () => {
    setEditingStore(null);
    setEditFormData({ name: "", category: "", floor: "" });
  };

  const handleEditChange = (e) => {
    setEditFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editingStore) return;

    dispatch(updateStore({ id: editingStore._id, updateData: editFormData }))
      .unwrap()
      .then(() => {
        closeEditModal();
      })
      .catch((err) => {
        alert("Failed to update store: " + err);
      });
  };

  // --- DELETE STORE HANDLER ---

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      dispatch(deleteStore(id)).catch((err) =>
        alert("Failed to delete store: " + err)
      );
    }
  };

  return (
    <div className="container mt-4">
      <h3>Manage Stores</h3>

      <button className="btn btn-success mb-3" onClick={openCreateModal}>
        Add New Store
      </button>

      {loading && (
        <div className="alert alert-info" role="alert">
          Loading stores...
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      )}

      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Floor</th>
            <th>Manager</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stores.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No stores available.
              </td>
            </tr>
          ) : (
            stores.map((store) => (
              <tr key={store._id}>
                <td>{store.name}</td>
                <td>{store.category}</td>
                <td>{store.floor}</td>
                <td>{store.manager?.name || "N/A"}</td>
                <td>{new Date(store.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => openEditModal(store)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(store._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* CREATE STORE MODAL */}
      {showCreateModal && (
        <div
          className="modal show fade"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog" role="document">
            <form onSubmit={handleCreateSubmit} className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Store</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeCreateModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="name-create" className="form-label">
                    Store Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name-create"
                    name="name"
                    value={createFormData.name}
                    onChange={handleCreateChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="category-create" className="form-label">
                    Category
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="category-create"
                    name="category"
                    value={createFormData.category}
                    onChange={handleCreateChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="floor-create" className="form-label">
                    Floor
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="floor-create"
                    name="floor"
                    value={createFormData.floor}
                    onChange={handleCreateChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeCreateModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STORE MODAL */}
      {editingStore && (
        <div
          className="modal show fade"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog" role="document">
            <form onSubmit={handleUpdate} className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Store</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeEditModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="name-edit" className="form-label">
                    Store Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name-edit"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="category-edit" className="form-label">
                    Category
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="category-edit"
                    name="category"
                    value={editFormData.category}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="floor-edit" className="form-label">
                    Floor
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="floor-edit"
                    name="floor"
                    value={editFormData.floor}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="col-md-3 mb-3">
        <Link to="/admin/*" className="btn btn-success w-100 p-4">
          Back To Dashboard
        </Link>
      </div>
    </div>
  );
}
