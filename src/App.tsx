import { useRoutes } from "react-router-dom";
import ListProducts from "./components/admin/ListProducts";
import AdminLayout from "./layout/admin";
import Dashboard from "./components/admin/Dashboard";
import AddProducts from "./components/admin/AddProducts";
import EditProducts from "./components/admin/EditProducts";
import Home from "./components/client/Home";
import ListCategory from "./components/admin/ListCategory";
import AddCategory from "./components/admin/AddCategory";
import EditCategory from "./components/admin/EditCategory";
import ListUser from "./components/admin/ListUser";
import AddUser from "./components/admin/AddUser";
import EditUser from "./components/admin/EditUser";
import Login from "./components/auth/Login";
import { AuthProvider } from "../src/components/auth/AuthContext";
import { OrderProvider } from "./components/client/OrderContext"; // Thêm OrderProvider
import { CartProvider } from "../src/components/client/CartContext"; // Thêm CartProvider
import ProtectedRoute from "../src/components/auth/ProtectedRoute";
import Register from "./components/auth/Register";
import RegisterAdmin from "./components/auth/RegisterAdmin";
import ClientLayout from "./layout/client";
import GoldPriceTable from "./components/client/GoldPrice";
import Cart from "./components/client/Cart";
import OrderAdmin from "./components/admin/OrderAdmin"; // Đổi tên từ CartAdmin
import UpdateOrder from "./components/admin/UpdateOrder"; // Đổi tên từ UpdateCart
import DetailOrder from "./components/admin/DetailOrder"; // Đổi tên từ DetailCart
import DetailProduct from "./components/client/DetailProduct";
import Checkout from "./components/client/Checkout";
import Order from "./components/client/Order";
import OrderDetail from "./components/client/OrderDetail";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import VerifyOtp from "./components/auth/VerifyOtp";
import RestoreUser from "./components/admin/RestoreUser";

export default function App() {
  const routes = useRoutes([
    // Route Admin (Chỉ dành cho Admin)
    {
      path: "/admin",
      element: (
        <ProtectedRoute adminOnly>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "detailorder/:id", element: <DetailOrder /> }, // Đổi tên route
        { path: "updateorder/:id", element: <UpdateOrder /> }, // Đổi tên route
        { path: "order", element: <OrderAdmin /> }, // Đổi tên route
        { path: "", element: <Dashboard /> },
        { path: "products", element: <ListProducts /> },
        { path: "addproducts", element: <AddProducts /> },
        { path: "editproducts/:id", element: <EditProducts /> },
        { path: "category", element: <ListCategory /> },
        { path: "addcategory", element: <AddCategory /> },
        { path: "editcategory/:id", element: <EditCategory /> },
        { path: "users", element: <ListUser /> },
        { path: "addusers", element: <AddUser /> },
        { path: "editusers/:id", element: <EditUser /> },
        { path: "restore-users", element: <RestoreUser /> },
      ],
    },

    // Route Client (Dành cho người dùng)
    {
      path: "/",
      element: <ClientLayout />,
      children: [
        { path: "detail/:id", element: <DetailProduct /> },
        { path: "", element: <Home /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "cart", element: <Cart /> },
        { path: "checkout", element: <Checkout /> },
        { path: "order", element: <Order /> },
        { path: "order-detail/:id", element: <OrderDetail /> },
        { path: "goldprice", element: <GoldPriceTable /> },
        { path: "forgot", element: <ForgotPassword /> },
        { path: "verify-otp", element: <VerifyOtp /> },
        { path: "reset-password", element: <ResetPassword /> },
      ],
    },

    // Route ẩn dành cho admin đăng ký
    { path: "/im_dev__do_u_know_that", element: <RegisterAdmin /> },
  ]);

  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider> {/* Thêm OrderProvider */}
          {routes}
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}