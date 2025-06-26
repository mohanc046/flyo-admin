import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "../Login/login";

import "../../assets/scss/style.scss";

import Home from "../Home/home";

import Products from "../Products/products";

import ProductList from "../ProductList/index";

import OrderList from "../OrderList/index";

import Orders from "../Order/orders";

import UserOrder from "../UserOrder/UserOrder";

import UserPayment from "../UserPayment/UserPayment";

import UserPlugins from "../UserPlugins/UserPlugins";

import UserCart from "../UserCart/UserCart";

import Store from "../Store/Store";

import Banner from "../Banner/Banner";

import Customer from "../Customer/Customer";

import _ from "lodash";

import { useStoreState } from "../../store/hooks";

import Logout from "../Logout/logout";
import Tracking from "../Tracking/Tracking";
import Shipping from "../Shipping/Shipping";
import Pricing from "../Pricing";
import ProductPreview from "../ProductPreview";
import UserOrderList from "../UserOrderList";
import Settings from "../Settings";
import Profile from "../Profile";
import WelcomeScreen from "../WelcomeScreen/WelcomeScreen";
import Setting from "../Settings";
import Checkout from "../Payment";
import PaymentSuccessCard from "../../components/Payment/success";
import Statistics from "../Statistics/Statistics";
import { StoreProductPreviewScreen } from "../StoreProductPreview/storeProductPreview";
import EditProduct from "../EditProduct/edit-products";
import VoucherContainer from "../VoucherList";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
import { useEffect } from "react";
import ReactGA from "react-ga";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import POSHome from "../POS/POSHome";
import POSOrders from "../POS/POSOrders/POSOrders";
import POSCustomers from "../POS/POSCustomers/POSCustomers";
import POSDiscounts from "../POS/POSDiscounts/POSDiscounts";

export default function App() {
  let loginStoreDetails = useStoreState((state) => state.user);

  let shopInformation = useStoreState((state) => state.shop.data);

  const { existingStoreInfo = [] } = loginStoreDetails.data;

  const { businessName = "" } = _.get(existingStoreInfo, "[0].store") || {};

  // const { authToken } = loginStoreDetails.data;

  const { pluginConfig = {}, storeInformation: exisintgShopInformation = {} } = shopInformation;

  const { propertyId = null, widgetId = null, isActive = false } = _.get(pluginConfig, "tawk", {});

  const {
    propertyId: googleAnalyticsTrackingId = null,
    isActive: isGoogleAnalyticsActive = false
  } = _.get(pluginConfig, "googleAnalytics", {});

  const {
    phoneNumber = null,
    isActive: isWhatsAppActive = false,
    userName = ""
  } = _.get(pluginConfig, "whatsApp", {});

  const isNotAdmin = !_.isEmpty(exisintgShopInformation);

  useEffect(() => {
    if (!_.isEmpty(googleAnalyticsTrackingId) && isGoogleAnalyticsActive && isNotAdmin) {
      ReactGA.initialize(`${googleAnalyticsTrackingId}`);
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }, [googleAnalyticsTrackingId, isGoogleAnalyticsActive, isNotAdmin]);

  const authToken = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Common routes for both authenticated and unauthenticated users */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/*" element={<Login />} /> */}
        <Route path="/user-cart" element={<UserCart />} />
        <Route path="/store/:storeName" element={<Store />} />
        <Route path="/login/user" element={<Login />} />
        <Route path="/user/order-list/:storeName" element={<UserOrderList />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/setting" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/preview" element={<ProductPreview />} />
        <Route path="/welcome-screen" element={<WelcomeScreen />} />
        <Route path="/payment/success/:storeId" element={<PaymentSuccessCard />} />
        <Route path="/store/preview" element={<StoreProductPreviewScreen />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/pos/home" element={<POSHome />} />
        <Route path="/pos/orders" element={<POSOrders />} />
        <Route path="/pos/customers" element={<POSCustomers />} />
        <Route path="/pos/discounts" element={<POSDiscounts />} />
        <Route path="/*" element={<Statistics />} />
        <Route path="/pricing-list" element={<Pricing />} />

        {authToken ? (
          /* Routes for authenticated users */
          <>
            <Route path="/*" element={<Statistics />} />
            <Route path="/home" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/edit-product" element={<EditProduct />} />
            <Route path="/product-list" element={<ProductList />} />
            <Route path="/order-list" element={<OrderList />} />
            <Route path="/order/:orderId" element={<Orders />} />
            <Route path="/user-order" element={<UserOrder />} />
            <Route path="/user-payment" element={<UserPayment name="Payments" />} />
            <Route path="/user-customer" element={<Customer />} />
            <Route path="/user-plugins" element={<UserPlugins />} />
            <Route
              path="/banner"
              element={<Banner authToken={authToken} businessName={businessName} />}
            />
            <Route path="/user-cart" element={<UserCart />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/preview" element={<ProductPreview />} />
            <Route path="/pricing-list" element={<Pricing />} />
            <Route path="/settings" element={<Setting />} />
            <Route path="/payment/success/:storeId" element={<PaymentSuccessCard />} />
            <Route path="/payment" element={<Checkout />} />
            <Route path="/discount" element={<VoucherContainer />} />
          </>
        ) : (
          <>
            <Route path="/*" element={<Statistics />} />
            <Route path="/pricing-list" element={<Pricing />} />
          </>
        )}
      </Routes>

      {/* Include the TawkMessengerReact component outside of Routes */}
      {isNotAdmin && propertyId && widgetId && isActive && (
        <TawkMessengerReact propertyId={propertyId} widgetId={widgetId} />
      )}

      {isNotAdmin && phoneNumber && isWhatsAppActive && userName && (
        <FloatingWhatsApp phoneNumber={`${phoneNumber}`} accountName={`${userName}`} />
      )}
    </Router>
  );
}
