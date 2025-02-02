import React, { useRef, useState } from "react";
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderToggler,
  CImage,
  CSidebarBrand
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMenu } from "@coreui/icons";
// import { useStoreState, useStoreActions } from "../store/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { notification } from "antd";
import { config } from "../config";
import { getUserProfile } from "../utils/_hooks";
import { getServiceURL, isMobileView } from "../utils/utils";

const AppHeader = ({
  heading = "",
  RightComponent = () => null,
  BottomComponent = () => null,
  showBrand = true,
  showAvatar = true,
  showAddProduct = false,
  styles = {},
  action = null,
  icon = cilMenu,
  showLogo = false,
  showAddDiscount = false,
  navigateToProductList = () => null,
  openDiscountModal = () => null
}) => {
  console.log("🚀 ~ heading:", heading);

  if (heading == "") return null;

  const [isLoader, setIsLoader] = useState(false);

  const userInfo = getUserProfile();

  const { businessName = "" } = _.get(userInfo, "existingStoreInfo[0].store", {});
  const showBreadCrumb = isMobileView();

  const navigate = useNavigate();

  const handleSampleFileDownload = () => {
    // Direct URL to the file in the public directory
    const fileUrl = "/product_bulk_upload.csv";

    // Create a temporary link and initiate download
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "product_bulk_upload.csv"; // Set the desired filename for download
    document.body.appendChild(link); // Append to the body
    link.click();
    document.body.removeChild(link); // Remove from the body after triggering download
  };

  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to handle file selection and API call
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoader(true);

    // Prepare the form data for the API
    const formData = new FormData();
    formData.append("file", file);
    formData.append("storeName", businessName);

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
        notification.success({ message });
        navigateToProductList();
      } else {
        notification.error({ message });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsLoader(false);
    }
  };

  return (
    <CHeader position="fixed" className="mb-4" style={styles}>
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          // onClick={() => (action ? action() : updateState({ sidebarShow: !sidebarShow }))}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            {showBreadCrumb && <CIcon style={{ marginRight: 10 }} icon={icon} size="lg" />}
            {showLogo && (
              <CSidebarBrand className={`d-none d-md-flex defaultBackgroundColor`} to="/">
                <CImage
                  className="margin-logo-right"
                  onClick={() => navigate("/")}
                  src={config.LOGO_BLUE}
                  height={48}
                  style={{ marginRight: 85, marginLeft: 10 }}
                />
              </CSidebarBrand>
            )}
            <div className="ps-1 app-heading">{heading}</div>
          </span>
        </CHeaderToggler>

        <RightComponent />

        {showBrand && (
          <CHeaderBrand className="mx-auto d-md-none " to="/">
            <CImage src={config.LOGO_BLUE} height={48} />
          </CHeaderBrand>
        )}

        {showAvatar && (
          <div className="flex alignCenter position-relative pointer opacity-0">
            <CImage className="header-userIcon" src={config.USER} height={48} />
            {`${businessName}  `}
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
        )}
        {showAddProduct && (
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary primary-color button FORT12 addButtonStyle"
              onClick={() => {
                //updateState({ "user.data.screenType": "ADD_PRODUCT_DETAILS" });
                navigate("/products");
              }}>
              + Add
            </button>
            <button className="button-primary-background" onClick={() => handleButtonClick()}>
              {isLoader ? (
                <div class="spinner-border text-light" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              ) : (
                "Bulk Upload"
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(event) => handleFileChange(event)}
              style={{ display: "none" }}
              accept=".csv"
            />
            <button className="button-with-border" onClick={handleSampleFileDownload}>
              Download Sample
            </button>
          </div>
        )}

        {showAddDiscount && (
          <div>
            <button
              className="btn btn-primary primary-color button FORT12 addDiscountButtonStyle"
              onClick={() => openDiscountModal()}>
              Add Discount
            </button>
          </div>
        )}
      </CContainer>
      <BottomComponent />
    </CHeader>
  );
};

export default AppHeader;
