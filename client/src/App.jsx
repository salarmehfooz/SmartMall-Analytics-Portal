import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Components/LoginPage";
import AdminDashboard from "./Components/AdminDashboard";
import StoreManagerDashboard from "./Components/StoreManagerDashboardPage";
import AdminStoresPage from "./Components/AdminStoresPage";
import AdminRecommendationPage from "./Components/AdminRecommendationsPage";
import AdminRegisterStoreManagerPage from "./Components/AdminRegisterStoreManagerPage";
import AdminTelcoTrendsPage from "./Components/AdminTelcoTrendsPage";
import AdminWalkInsPage from "./Components/AdminWalkInsPage";
import StoreManagerTelcoTrendsPage from "./Components/StoreManagerTelcoTrendsPage";
import StoreManagerWalkInLogsPage from "./Components/StoreManagerWalkInLogsPage";
import HomePage from "./Components/Homepage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="/admin/stores" element={<AdminStoresPage />} />
      <Route path="/admin/walkins" element={<AdminWalkInsPage />} />
      <Route path="/admin/telcotrends" element={<AdminTelcoTrendsPage />} />
      <Route
        path="/admin/recommendations"
        element={<AdminRecommendationPage />}
      />
      <Route
        path="/admin/register-storemanager"
        element={<AdminRegisterStoreManagerPage />}
      />
      <Route path="/store-manager/*" element={<StoreManagerDashboard />} />
      <Route
        path="/storemanager/walkins"
        element={<StoreManagerWalkInLogsPage />}
      />
      <Route
        path="/storemanager/telcotrends"
        element={<StoreManagerTelcoTrendsPage />}
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
