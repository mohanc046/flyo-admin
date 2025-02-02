import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setTitle } from "../../../store/reducers/headerTitleSlice";
import Switch from "../../../components/Switch/Switch";
import { useNavigate } from "react-router-dom";
import { getStoreInfo } from "../../../utils/_hooks";
import { fetchProducts } from "../../../utils/api.service";
import ImgOrVideoRenderer from "../../../components/ImgOrVideoRenderer/ImgOrVideoRenderer";
import { generateXlsxReport, getServiceURL, isImageUrl } from "../../../utils/utils";
import axios from "axios";
import { hideSpinner, showSpinner } from "../../../store/reducers/spinnerSlice";
import { showToast } from "../../../store/reducers/toasterSlice";
import _ from "lodash";
import { FIXED_VALUES } from "../../../utils/constants";
const {
  statusCode: { SUCCESS }
} = FIXED_VALUES;

export const useProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(null);
  const debounceRef = useRef(null);
  const fileInputRef = useRef(null);
  const [state, setState] = useState({
    loaderStatus: false,
    productsList: [],
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

  useEffect(() => {
    dispatch(setTitle("All Products"));
  }, []);

  useEffect(() => {
    loadProducts(payload);
  }, [payload]);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const updateProduct = async ({ productId, isActive }) => {
    try {
      setState((prevState) => ({ ...prevState, loaderStatus: true }));
      const response = await axios.post(`${getServiceURL()}/product/update`, {
        payload: { isActive },
        _id: productId
      });
      if (response?.data?.statusCode === 200) {
        const updatedProductList = _.get(state, 'productsList', []).map(item =>
          item._id === productId ? { ...item, isActive } : item
        );
        setState((prevState) => ({ ...prevState, productsList: updatedProductList }));
        // Update the state immutably using setState and map
        dispatch(showToast({ type: "success", message: "Product Updated successful!" }));
      }
    } catch (error) {
      dispatch(showToast({ type: "error", message: "Issue while update products" }));
    } finally {
      setState((prevState) => ({ ...prevState, loaderStatus: false }));
    }
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    dispatch(showSpinner());
    // Prepare the form data for the API
    const formData = new FormData();
    formData.append("file", file);
    formData.append("storeName", getStoreInfo().store?.domainName);

    try {
      // Send the file to the backend API using getServiceURL()
      const response = await axios.post(`${getServiceURL()}/product/bulk/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      // Handle response (for example, notify the user of success)
      console.log("Upload successful", response.data);

      const { statusCode = 500, message = "Issue while Bulk upload!" } = response.data || {};

      if (statusCode === 200) {
        dispatch(showToast({ type: "success", title: "Success", message: message }));
        loadProducts(payload);
      } else {
        dispatch(showToast({ type: "error", title: "Error", message: message }));
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      dispatch(hideSpinner());
    }
  };

  const downloadReport = async () => {
    try {
      dispatch(showSpinner());

      const { storeName = "", searchText = "", sort = -1, category = "" } = payload;

      let URL = getServiceURL();

      let productsResponse = await axios.get(
        `${URL}/product/all/download/${storeName}/?category=${category}&searchText=${searchText}&sort=${sort}`
      );

      const {
        data: { statusCode = "500", message = "Issue while fetching products", products = [] }
      } = productsResponse;

      let formattedProductList = [];

      if (statusCode === SUCCESS) {
        formattedProductList.push([
          "Product Id",
          "Product Name",
          "Product Description",
          "Category",
          "Price",
          "Discount Price",
          "isActive"
        ]);

        _.forEach(products, (item) => {
          const {
            _id = "",
            productName,
            productDescription,
            images,
            categoryType,
            price,
            discountPrice,
            isActive
          } = item;

          formattedProductList.push([
            _id,
            productName,
            productDescription,
            _.get(categoryType, "name", ""),
            price,
            discountPrice,
            isActive
          ]);
        });

        generateXlsxReport(formattedProductList, "products");
        dispatch(hideSpinner());
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

  const handleCategorySelect = (category) => {
    setPayload((prevState) => ({ ...prevState, categoryType: category }));
  };

  const handleSearch = (event) => {
    const searchQuery = event.target.value;

    // Clear the previous timeout
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

  const loadProducts = async (payload) => {
    try {
      setState((prevState) => ({ ...prevState, loaderStatus: true }));

      const data = await fetchProducts(payload);
      if (data.statusCode === 200) {
        setTotalItems(data?.products?.length);
        setState((prevState) => ({ ...prevState, productsList: data?.products }));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setState((prevState) => ({ ...prevState, loaderStatus: false }));
    }
  };

  const mapProductDataToTable = (products) =>
    products.map((product) => ({
      _id: product._id,
      item_image: {
        url: product.images?.[0] || "",
        type: isImageUrl(product.images?.[0]) ? "image" : "video"
      },
      productName: product.productName || "N/A",
      productDescription: product.productDescription || "N/A",
      discountPrice: product.discountPrice || "",
      productCategory: product.categoryType || "",
      amount: `₹${product.price || 0}`,
      price: product.price,
      quantity: product.inventory?.quantity,
      sizes: product?.inventory?.sizes || "",
      colors: product?.inventory?.colors || "",
      shipmentWeight: product?.orderDetails?.shippingWeight || "",
      barcode: product?.orderDetails?.barcode || "",
      gstPercentage: product?.orderDetails?.gstPercentage || "",
      status: product.isActive ? "active" : "hidden"
    }));

  const columns = [
    {
      label: "Item",
      key: "item_image",
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
          <h5 className="mb-0">{row.productName}</h5>
        </div>
      )
    },
    { label: "Amount", key: "amount" },
    { label: "Inventory", key: "quantity" },
    {
      label: "Status",
      key: "status",
      renderClickAction: false,
      render: (value, row) => (
        <Switch
          initialStatus={value} // Ensure value is a string like "active" or "hidden"
          activeText="Active"
          hiddenText="Inactive"
          onToggle={(newStatus) => {
            updateProduct({ productId: row?._id, isActive: newStatus === "active" ? true : false })
          }}
        />
      )
    }
  ];

  const handleNavigateAddproduct = () => {
    navigate("/product-list/add-product");
  };

  const handleNavigateProductDetails = (rowData) => {
    console.log(rowData);
    if (rowData?._id) {
      navigate(`/product/${rowData._id}`, {
        state: rowData
      });
    } else {
      console.error("Product ID is missing in rowData.");
    }
  };

  return {
    handleCategorySelect,
    columns,
    state,
    payload,
    mapProductDataToTable,
    dispatch,
    handleNavigateAddproduct,
    onApplySortFilter,
    onClearFilterChange,
    handleSearch,
    handlePerPageRowsChange,
    handlePageChange,
    currentPage,
    rowsPerPage,
    totalItems,
    handleNavigateProductDetails,
    fileInputRef,
    handleButtonClick,
    handleFileChange,
    downloadReport
  };
};
