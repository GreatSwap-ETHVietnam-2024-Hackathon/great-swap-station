import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import MainApp from "./pages/MainApp";
import BotSettings from './pages/bot-settings';
import Wallets from "./pages/wallets";
import ATIK from "./pages/ATIK";

export interface LinkItem {
  path: string,
  label: string,
  element: JSX.Element
}

function App() {

  const links: LinkItem[] = [
    { path: '/wallets', label: "Wallets", element: <Wallets /> },
    { path: '/ATIK', label: "ATIK", element: <ATIK /> },
    { path: '/bot-settings/:telegramId', label: "Bot Settings", element: <BotSettings /> },
    { path: '/bot-settings', label: "Bot Settings", element: <BotSettings /> },
  ]

  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainApp links={links} children={<Outlet />} />,
      errorElement: <Navigate to={'/'} replace />,
      children: [
        {
          index: true,
          element: <Navigate to={'/bot-settings/'} replace />
        },
        ...links
      ]
    }

  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App;
