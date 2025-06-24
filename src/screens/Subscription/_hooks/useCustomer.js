import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setTitle } from "../../../store/reducers/headerTitleSlice";
import { getSubscriptionHistory, initiatePaymentSubscription } from "../../../utils/api.service";
import { getStoreInfo } from "../../../utils/_hooks";
import _ from "lodash";
import moment from "moment";

export const useCustomer = () => {
  const dispatch = useDispatch();
  const categories = [{ label: "All", value: "ALL" }];
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(null);
  const debounceRef = useRef(null);

  const [state, setState] = useState({
    loaderStatus: false,
    isSubscriptionCreationSuccess: false,
    subscriptionErrorMessage: "",
    paymentLoaderStatus: false,
    orderList: [],
    currentPage: 1,
    totalPages: 0
  });

  const [payload, setPayload] = useState({
    storeName: getStoreInfo()?.store?.domainName || "DefaultStore",
    currentPage: 1,
    limit: 10,
    sort: -1
  });

  const handleCategorySelect = (category) => {
    console.log("Selected Category:", category);
  };
  

  useEffect(() => {
    dispatch(setTitle("All Customers"));
  }, []);

  useEffect(() => {
    loadCustomers(payload);
  }, [payload]);

  const loadCustomers = async (payload) => {
    try {
      setState((prevState) => ({ ...prevState, loaderStatus: true }));

      let listOfOrders = [];
      const response = await getSubscriptionHistory(payload);
      if (_.get(response, "statusCode") === "success") {
        listOfOrders = response?.placedOrders?.map((item) => ({
          subscriptionId: item.subscriptionId,
          customerId: item.customerId,
          startDate: moment(item.startDate).format("DD MMM YYYY"),
          endDate: moment(item.endDate).format("DD MMM YYYY"),
          invoicePdfUrl: item.invoicePdf,
          paymentLinkUrl: item.paymentLink,
          status: item.status,
        }));
      }

      setState((prevState) => ({ ...prevState, orderList: listOfOrders }));
      setTotalItems(response?.orders?.length);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setState((prevState) => ({ ...prevState, loaderStatus: false }));
    }
  };

  const initiatePaymentSchedule = async (payload) => {
    try {

      setState((prevState) => ({ ...prevState, paymentLoaderStatus: true }));

      const response = await initiatePaymentSubscription(payload);

      if (_.get(response, "statusCode") === "success") {

        setState((prevState) => ({
          ...prevState,
          isSubscriptionCreationSuccess: true
        }));

      } else {

        setState((prevState) => ({
          ...prevState,
          isSubscriptionCreationSuccess: false,
          subscriptionErrorMessage: "Issue while creation, try after sometime!"
        }));
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setState((prevState) => ({ ...prevState, paymentLoaderStatus: false }));
    }
  };

  const columns = [
    {
      label: "Subscription ID",
      key: "subscriptionId",
      render: (value, row) => (
        <span className="text-truncate" title={value}>
          {value}
        </span>
      ),
    },
    {
      label: "Customer ID",
      key: "customerId",
      render: (value) => <span className="text-muted">{value}</span>,
    },
    {
      label: "Start Date",
      key: "startDate",
      render: (value) => <span>{value}</span>,
    },
    {
      label: "End Date",
      key: "endDate",
      render: (value) => <span>{value}</span>,
    },
    {
      label: "Invoice",
      key: "invoicePdfUrl",
      render: (value) =>
        value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
            View PDF
          </a>
        ) : (
          "-"
        ),
    },
    {
      label: "Payment Link",
      key: "paymentLinkUrl",
      render: (value) =>
        value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
            Pay Now
          </a>
        ) : (
          "-"
        ),
    },
    {
      label: "Status",
      key: "status",
      render: (value) => {
        const statusClass = value === "complete" ? "text-success" : "text-warning";
        return <span className={statusClass}>{value}</span>;
      },
    },
  ];


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
    setPayload((prevState) => ({ ...prevState, limit: rows }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setPayload((prevState) => ({ ...prevState, currentPage: page }));
  };

  return {
    categories,
    handleCategorySelect,
    columns,
    dispatch,
    state,
    payload,
    onApplySortFilter,
    onClearFilterChange,
    handleSearch,
    handlePerPageRowsChange,
    handlePageChange,
    currentPage,
    totalItems,
    rowsPerPage,
    initiatePaymentSchedule
  };
};
