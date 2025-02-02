import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setTitle } from "../../../store/reducers/headerTitleSlice";
import axios from "axios";
import { getServiceURL, isImageUrl } from "../../../utils/utils";
import { getStoreInfo, getUserProfile } from "../../../utils/_hooks";
import ImgOrVideoRenderer from "../../../components/ImgOrVideoRenderer/ImgOrVideoRenderer";
import "../Home.scss";
import Button from "../../../components/Button/Button.jsx";
import * as Icon from "react-feather";
import { statusColors } from "../../Order/OrderList.constants.js";
import { hideSpinner, showSpinner } from "../../../store/reducers/spinnerSlice.js";
import { FIXED_VALUES } from "../../../utils/constants.js";
import { showToast } from "../../../store/reducers/toasterSlice.js";
const {
  statusCode: { SUCCESS }
} = FIXED_VALUES;

export const useHome = () => {
  const userInfo = getUserProfile();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(null);
  const debounceRef = useRef(null);
  const [statsData, setStatsData] = useState({
    totalSalesInfo: "",
    totalOrderReceivedToday: "",
    totalProductsCount: ""
  });

  const [state, setState] = useState({
    loaderStatus: false,
    orderList: [],
    currentPage: 1,
    totalPages: 0
  });

  const [payload, setPayload] = useState({
    storeName: getStoreInfo()?.store?.domainName || "DefaultStore",
    searchText: "",
    currentPage: 1,
    itemPerPage: 10,
    categoryType: "ALL",
    activeStatusTab: null,
    sort: -1
  });

  useEffect(() => {
    dispatch(setTitle("Home"));
    fetchStatsData();
  }, []);

  useEffect(() => {
    fetchOrders(payload);
  }, [payload]);

  const fetchStatsData = async () => {
    try {
      dispatch(showSpinner());

      let orderSummaryResponse = await axios.get(
        `${getServiceURL()}/order/analytics/${getStoreInfo()?.store?.domainName}`
      );

      const {
        data: {
          statusCode = "500",
          message = "Issue while fetching order summary",
          totalSalesInfo = {},
          totalOrderReceivedToday = {},
          totalProductsCount = 0
        }
      } = orderSummaryResponse;

      if (statusCode === SUCCESS) {
        setStatsData({
          totalSalesInfo,
          totalOrderReceivedToday,
          totalProductsCount
        });
        console.log(totalSalesInfo);
        console.log(totalOrderReceivedToday);
        console.log(totalProductsCount);
      } else {
        dispatch(showToast({ type: "error", title: "Error", message: message }));
      }
    } catch (error) {
      dispatch(hideSpinner());
    } finally {
      dispatch(hideSpinner());
    }
  };

  const onApplySortFilter = (sort) => {
    const updatedSortValue = sort > 0 ? -1 : 1;
    setPayload((prevState) => ({ ...prevState, sort: updatedSortValue }));
  };

  const onClearFilterChange = () => {
    setPayload((prevState) => ({
      ...prevState,
      currentPage: 1,
      categoryType: "ALL",
      activeStatusTab: null
    }));
  };

  const handleSearch = (event) => {
    const searchQuery = event.target.value;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setPayload((prevState) => ({ ...prevState, searchText: searchQuery }));
    }, 500);
  };

  const handlePerPageRowsChange = (rows) => {
    setRowsPerPage(rows);
    setPayload((prevState) => ({ ...prevState, itemPerPage: rows }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setPayload((prevState) => ({ ...prevState, currentPage: page }));
  };

  const fetchOrders = async (payload) => {
    try {
      setState((prevState) => ({ ...prevState, loaderStatus: true }));

      const {
        storeName,
        currentPage,
        itemPerPage,
        categoryType,
        sort,
        activeStatusTab,
        searchText
      } = payload;
      const URL = getServiceURL();
      const response = await axios.get(
        `${URL}/order/store/${storeName}?page=${currentPage}&itemsPerPage=${itemPerPage}&category=${categoryType}&searchText=${searchText}&sort=${sort}`
      );

      const {
        data: { message, orderList = [], totalPages = 0, totalOrderCount = 0 }
      } = response;

      if (response?.status === 200) {
        setTotalItems(totalOrderCount);
        let filteredOrderList = [...orderList];

        if (activeStatusTab) {
          const statusMapping = {
            Received: "PENDING",
            Shipped: "SHIPPED",
            Delivered: "DELIVERED"
          };

          const filterStatus = statusMapping[activeStatusTab];
          if (filterStatus) {
            filteredOrderList = filteredOrderList.filter((order) => order.status === filterStatus);
          }
        }

        const formattedOrderList = filteredOrderList.map((order) => {
          const product = order.products?.[0]?.product || {};
          const mediaUrl = product.images?.[0] || "";
          const mediaType = isImageUrl(mediaUrl) ? "image" : "video";

          return {
            item_media: { url: mediaUrl, type: mediaType },
            item_name: product.productName || "N/A",
            orderId: order.orderId || "N/A",
            amount: `₹${order.totalOrderCost || 0}`,
            location: `${order.shippingAddress?.street || ""}, ${order.shippingAddress?.state || ""}`,
            status: order.status || "Pending"
          };
        });

        setState((prevState) => ({
          ...prevState,
          orderList: formattedOrderList,
          currentPage,
          totalPages
        }));
      } else {
        console.error(message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setState((prevState) => ({ ...prevState, loaderStatus: false }));
    }
  };

  const mapOrderDataToTable = (orders) =>
    orders.map((order) => ({
      item_media: order.item_media,
      item_name: order.item_name,
      orderId: order.orderId,
      amount: order.amount,
      location: order.location,
      status: order.status
    }));

  const columns = [
    {
      label: "Item",
      key: "item_media",
      render: (value, row) => (
        <div className="d-flex align-items-center gap-3">
          <ImgOrVideoRenderer
            className="me-3"
            src={value.url}
            width="45"
            height="45"
            description="product media"
            videoStyles={{ borderRadius: "50%" }}
          />
          <h5 className="mb-0">{row.item_name}</h5>
        </div>
      )
    },
    { label: "Order ID", key: "orderId" },
    { label: "Amount", key: "amount" },
    { label: "Location", key: "location" },
    {
      label: "Status",
      key: "status",
      render: (value) => (
        <div className="d-flex gap-2 align-items-center">
          <span
            className="p-2 rounded-circle"
            style={{ backgroundColor: statusColors[value] || "#333" }}
          />
          <span>{value}</span>
        </div>
      )
    }
  ];

  const visitStoreColumns = [
    {
      label: "Shop Link",
      key: "shopLink"
    },
    {
      label: "Status",
      key: "status",
      render: (value, row) => (
        <div className="d-flex align-items-center">
          <h5 className="mb-0 live">{value}</h5> {/* Ensure `value` is a valid string */}
        </div>
      )
    },
    {
      label: "Actions",
      key: "action",
      render: (value, row) => (
        <div>
          <Button
            label={"Visit"}
            icon={<Icon.Eye size={15} />}
            onClick={() => window.open(row.shopLink, "_blank")}
            className="visit-button"
          />
        </div>
      )
    }
  ];

  const visitStoreData = [
    {
      shopLink: `http://${getStoreInfo()?.store?.domainName}.${process.env.REACT_APP_DOMAIN_EXTENSION || "afras.in"}`,
      status: "LIVE",
      action: "Visit"
    }
  ];

  return {
    columns,
    state,
    mapOrderDataToTable,
    onApplySortFilter,
    onClearFilterChange,
    payload,
    visitStoreColumns,
    visitStoreData,
    handleSearch,
    handlePerPageRowsChange,
    handlePageChange,
    currentPage,
    totalItems,
    rowsPerPage,
    userInfo,
    statsData
  };
};
