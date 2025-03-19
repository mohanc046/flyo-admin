import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setTitle } from "../../../store/reducers/headerTitleSlice";
import { getCustomersByUserId } from "../../../utils/api.service";
import { getStoreInfo } from "../../../utils/_hooks";
import _ from "lodash";
import { Image } from "react-bootstrap";
import { CImage } from "@coreui/react";

export const useCustomer = () => {
  const dispatch = useDispatch();
  const categories = [{ label: "All", value: "ALL" }];
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(null);
  const debounceRef = useRef(null);

  const [state, setState] = useState({
    loaderStatus: false,
    customersList: [],
    currentPage: 1,
    totalPages: 0
  });

  const [payload, setPayload] = useState({
    storeName: getStoreInfo()?.store?.domainName || "DefaultStore",
    currentPage: 1,
    limit: 10,
    categoryType: "ALL",
    searchText: "",
    activeStatusTab: null,
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

      let listOfCustomers = [];
      const response = await getCustomersByUserId(payload);
      if (_.get(response, "statusCode") === 200) {
        listOfCustomers = response?.orders?.map((item) => ({
          name: _.get(item, "userId.email"),
          mobile: _.get(item, "mobile") || "-",
          city: _.get(item, "shippingAddress.state"),
          pinCode: _.get(item, "shippingAddress.pinCode"),
          orderCount: _.get(item, "totalOrderCost"),
          salesCount: "-"
        }));
      }

      setState((prevState) => ({ ...prevState, customersList: listOfCustomers }));
      setTotalItems(response?.orders?.length);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setState((prevState) => ({ ...prevState, loaderStatus: false }));
    }
  };

  const columns = [
    {
      label: "Customer Name",
      key: "name",
      render: (value, row) => (
        <div className="d-flex align-items-center gap-3">
          <CImage src={require("../../../assets/images/user.png")} width={40} height={40} />
          <h5 className="mb-0">{row.name}</h5>
        </div>
      )
    },
    { label: "Mobile Number", key: "mobile" },
    { label: "City", key: "city" }
  ];

  const onApplySortFilter = (sort) => {
    const updatedSortValue = sort === 1 ? -1 : 1;
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
    rowsPerPage
  };
};
