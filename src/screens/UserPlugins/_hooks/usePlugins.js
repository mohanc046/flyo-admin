import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTitle } from "../../../store/reducers/headerTitleSlice";
import { config } from "../../../config";
import whatsAppLogo from "../../../assets/images/whatsapp-logo.svg";
import axios from "axios";
import { getServiceURL } from "../../../utils/utils";
import { showToast } from "../../../store/reducers/toasterSlice";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { getStoreInfo } from "../../../utils/_hooks";
import { hideSpinner, showSpinner } from "../../../store/reducers/spinnerSlice";

export const usePlugins = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [currentPlugin, setCurrentPlugin] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const { store } = getStoreInfo() || {};
  const { pluginConfig = {} } = store || {};
  const { tawk, googleAnalytics, whatsApp } = pluginConfig;

  const PluginConfig = [
    {
      title: "Tawk.To : Live Chat",
      description:
        "Offer 24/7 customer support and monitor site visitors with a live chat feature.",
      image: config.TAWK_TO_LOGO,
      isActive: tawk?.isActive,
      uninstallAction: () => uninstallChatPluginConfig(),
      category: ["Customer Support"]
    },
    {
      title: "Google Analytics",
      description:
        "Enable Instagram to set up a Business page where you can create and share your shop.",
      image: config.GOOGLE_ANALYTICS,
      isActive: googleAnalytics?.isActive,
      uninstallAction: () => uninstallGoogleAnalyticsPluginConfig(),
      category: ["Marketing"]
    },
    {
      title: "WhatsApp",
      description:
        "Enable WhatsApp to set up a Business profile where you can create and share your shop.",
      image: whatsAppLogo,
      isActive: whatsApp?.isActive,
      uninstallAction: () => uninstallWhatsAppPluginConfig(),
      category: ["Customer Support"]
    }
  ];

  const filteredPlugins =
    selectedCategory === "ALL"
      ? PluginConfig
      : PluginConfig.filter((plugin) => plugin.category?.includes(selectedCategory));

  const toggle = (plugin) => {
    setModal(!modal);
    setCurrentPlugin(plugin);
  };

  const uninstallChatPluginConfig = async () => {
    try {
      dispatch(showSpinner());
      const storeInfo = JSON.parse(localStorage.getItem("storeInfo"));
      if (!storeInfo || !storeInfo.store || !storeInfo.store.domainName) {
        throw new Error("Invalid store information.");
      }

      const storeName = storeInfo.store.domainName;

      const requestPayload = { pluginType: "TAWK", isActive: false };

      const response = await axios.put(
        `${getServiceURL()}/store/plugin/config/${storeName}`,
        requestPayload
      );

      const { statusCode = 500, message = "Issue while update plugin config!" } =
        response.data || {};

      if (statusCode === 200) {
        const updatedStoreInfo = {
          ...storeInfo,
          store: {
            ...storeInfo.store,
            pluginConfig: {
              ...storeInfo.store?.pluginConfig,
              tawk: requestPayload
            }
          }
        };

        localStorage.setItem("storeInfo", JSON.stringify(updatedStoreInfo));
        dispatch(
          showToast({
            type: "success",
            title: "Successs",
            message: "Plugin uninstall successfully!"
          })
        );
        dispatch(hideSpinner());
        navigate("/home");
        return;
      } else {
        dispatch(hideSpinner());
        return notification.open({ type: "warning", message });
      }
    } catch (error) {
      dispatch(hideSpinner());
      notification.open({ type: "warning", message: "Issue while configuring plugin!" });
      dispatch(
        showToast({ type: "error", title: "Error", message: "Issue while uninstall plugin!" })
      );
    }
  };

  const uninstallGoogleAnalyticsPluginConfig = async () => {
    try {
      dispatch(showSpinner());
      const storeInfo = JSON.parse(localStorage.getItem("storeInfo"));
      if (!storeInfo || !storeInfo.store || !storeInfo.store.domainName) {
        throw new Error("Invalid store information.");
      }

      const storeName = storeInfo.store.domainName;

      const requestPayload = { pluginType: "GOOGLE_ANALYTICS", isActive: false };

      const response = await axios.put(
        `${getServiceURL()}/store/plugin/config/${storeName}`,
        requestPayload
      );

      const { statusCode = 500, message = "Issue while update plugin config!" } =
        response.data || {};

      if (statusCode === 200) {
        const updatedStoreInfo = {
          ...storeInfo,
          store: {
            ...storeInfo.store,
            pluginConfig: {
              ...storeInfo.store.pluginConfig,
              googleAnalytics: requestPayload
            }
          }
        };

        localStorage.setItem("storeInfo", JSON.stringify(updatedStoreInfo));

        dispatch(
          showToast({
            type: "success",
            title: "Success",
            message: "Plugin uninstalled successfully!"
          })
        );
        dispatch(hideSpinner());
        navigate("/home");
        return;
      } else {
        dispatch(hideSpinner());
        return notification.open({ type: "warning", message });
      }
    } catch (error) {
      dispatch(
        showToast({ type: "error", title: "Error", message: "Issue while uninstall plugin!" })
      );
      dispatch(hideSpinner());
    }
  };

  const uninstallWhatsAppPluginConfig = async () => {
    try {
      dispatch(showSpinner());
      const storeInfo = JSON.parse(localStorage.getItem("storeInfo"));
      if (!storeInfo || !storeInfo.store || !storeInfo.store.domainName) {
        throw new Error("Invalid store information.");
      }

      const storeName = storeInfo.store.domainName;

      const requestPayload = { pluginType: "WHATSAPP", isActive: false };

      const response = await axios.put(
        `${getServiceURL()}/store/plugin/config/${storeName}`,
        requestPayload
      );

      const { statusCode = 500, message = "Issue while update plugin config!" } =
        response.data || {};

      if (statusCode === 200) {
        const updatedStoreInfo = {
          ...storeInfo,
          store: {
            ...storeInfo.store,
            pluginConfig: {
              ...storeInfo.store.pluginConfig,
              whatsApp: requestPayload
            }
          }
        };

        localStorage.setItem("storeInfo", JSON.stringify(updatedStoreInfo));
        dispatch(
          showToast({
            type: "success",
            title: "Success",
            message: "Plugin uninstalled successfully!"
          })
        );
        dispatch(hideSpinner());
        navigate("/home");
        return;
      } else {
        dispatch(hideSpinner());
        return notification.open({ type: "warning", message });
      }
    } catch (error) {
      dispatch(
        showToast({ type: "error", title: "Error", message: "Issue while uninstall plugin!" })
      );
      dispatch(hideSpinner());
    }
  };

  useEffect(() => {
    dispatch(setTitle("Plugins"));
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return {
    handleCategorySelect,
    toggle,
    currentPlugin,
    modal,
    PluginConfig,
    selectedCategory,
    filteredPlugins
  };
};
