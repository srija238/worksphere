import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '../layouts/index';
import LoginPage from '../../pages/Login/index';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <AppLayout>
              <LoginPage />
            </AppLayout>
          }
        />
        <Route
          path="/"
          element={
            <AppLayout>
              <LoginPage />
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
