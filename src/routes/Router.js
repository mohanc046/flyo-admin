import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Loadable from "../layouts/loader/Loadable.js";
import { getAuthToken, getStoreInfo } from "../utils/_hooks/index.js";
import Logout from "../screens/Logout.jsx";
import { useSelector } from "react-redux";
import _ from "lodash";
import Pricing from "../screens/Pricing/index.jsx";
/***** Layouts *****/
const FullLayout = Loadable(lazy(() => import("../layouts/FullLayout.js")));
const BlankLayout = Loadable(lazy(() => import("../layouts/BlankLayout.js")));

/***** Pages *****/
const Landing = Loadable(lazy(() => import("../screens/Statistics/Statistics.jsx")));
const Login = Loadable(lazy(() => import("../screens/Login/login.jsx")));
const Home = Loadable(lazy(() => import("../screens/Home/home.jsx")));
const OrderList = Loadable(lazy(() => import("../screens/Order/OrderList.jsx")));
const OrderDetails = Loadable(lazy(() => import("../screens/OrderDetails/OrderDetails.jsx")));
const ProductList = Loadable(lazy(() => import("../screens/ProductList/ProductList.jsx")));
const ProductDetails = Loadable(lazy(() => import("../screens/ProductDetails/ProductDetails.jsx")));
const AddProduct = Loadable(lazy(() => import("../screens/AddProduct/AddProduct.jsx")));
const OnlineShop = Loadable(lazy(() => import("../screens/OnlineShop/OnlineShop.jsx")));
const Payments = Loadable(lazy(() => import("../screens/UserPayment/Payments.jsx")));
const Customers = Loadable(lazy(() => import("../screens/Customers/Customers.jsx")));
const Subscription = Loadable(lazy(() => import("../screens/Subscription/Subscription.jsx")));
const Plugins = Loadable(lazy(() => import("../screens/UserPlugins/Plugins.jsx")));
const Discounts = Loadable(lazy(() => import("../screens/Discounts/Discounts.jsx")));
const Settings = Loadable(lazy(() => import("../screens/Settings/Settings.jsx")));

/***** Auth Pages *****/
const Error = Loadable(lazy(() => import("../views/auth/Error.js")));

/***** Custom Hook to Get Token *****/
const useAuthToken = () => {
  const localToken = getAuthToken();
  const reduxToken = useSelector((state) => state.authToken.token);
  return localToken || reduxToken;
};

/***** Routes Component *****/
const ThemeRoutes = () => {
  const authToken = useAuthToken();

  return [
    {
      path: "/",
      element: authToken && !_.isEmpty(getStoreInfo()) ? <FullLayout /> : <BlankLayout />,
      children:
        authToken && !_.isEmpty(getStoreInfo())
          ? [
              { path: "/", element: <Home /> },
              { path: "/order-list", element: <OrderList /> },
              { path: "/order/:id", element: <OrderDetails /> },
              { path: "/product-list", element: <ProductList /> },
              { path: "/product/:id", element: <ProductDetails /> },
              { path: "/product-list/add-product", element: <AddProduct /> },
              { path: "/online-shop", element: <OnlineShop /> },
              { path: "/payments", element: <Payments /> },
              { path: "/customers", element: <Customers /> },
              { path: "/subscription", element: <Subscription /> },
              { path: "/plugins", element: <Plugins /> },
              { path: "/discounts", element: <Discounts /> },
              { path: "/settings", element: <Settings /> },
              { path: "/sign-out", element: <Logout /> },
              { path: "/*", element: <Home /> }
            ]
          : [
              { path: "/login", element: <Login /> },
              { path: "/home", element: <Landing /> },
              { path: "/login", element: <Navigate to="/" /> },
              { path: "", element: <Landing /> },
              { path: "/", element: <Landing /> },
              { path: "/*", element: <Landing /> },
              { path: "/pricing-list", element: <Pricing /> }
            ]
    },
    {
      path: "/404",
      element: <Error />
    }
  ];
};

export default ThemeRoutes;
/**
 * 
 * 
 *           { path: "/registerformik", element: <RegisterFormik /> },
             { path: "/maintenance", element: <Maintenance /> },
             { path: "/lockscreen", element: <LockScreen /> },
             { path: "/recoverpwd", element: <RecoverPassword /> },
 * 
 */
