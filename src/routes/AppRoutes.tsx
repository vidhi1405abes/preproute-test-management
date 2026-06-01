import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { CreateTestPage } from "../pages/CreateTestPage";
import { DashboardPage } from "../pages/DashboardPage";
import { EditTestPage } from "../pages/EditTestPage";
import { LoginPage } from "../pages/LoginPage";
import { PreviewPublishPage } from "../pages/PreviewPublishPage";
import { QuestionBuilderPage } from "../pages/QuestionBuilderPage";

function ProtectedRoute() {
  const token = localStorage.getItem("preproute_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tests/create" element={<CreateTestPage />} />
        <Route path="/tests/:id/edit" element={<EditTestPage />} />
        <Route path="/tests/:id/questions" element={<QuestionBuilderPage />} />
        <Route path="/tests/:id/preview" element={<PreviewPublishPage />} />
      </Route>
    </Routes>
  );
}