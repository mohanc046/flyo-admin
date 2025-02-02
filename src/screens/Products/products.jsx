import _ from "lodash";
import React, { Fragment, useState, useRef, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CRow,
  CImage,
  CModal,
  CModalBody,
} from "@coreui/react";
import {
  CAccordion,
  CAccordionItem,
  CAccordionBody,
  CAccordionHeader,
} from "@coreui/react";
import { useNavigate } from "react-router-dom";
import { useStoreState, useStoreActions } from "../../store/hooks";
import { AppSidebar, AppFooter, AppHeader } from "../../components/index";
import { Toaster } from "react-hot-toast";
import { config } from "../../config";
import {
  renderTitle,
  renderButton,
  renderDropdown,
  renderInputBox,
  renderDropdownTwo,
  MobileTabUI,
  renderAddProductInputBox,
} from "../../utils/utilsUI";
import "./products.css";
import axios from "axios";

import { getServiceURL } from "../../utils";
import { Col, notification } from "antd";
import { fetchProducts } from "../../utils/api.service";
import VideoRecorder from "react-video-recorder";
import ImgOrVideoRenderer from "../../components/ImgOrVideoRenderer/ImgOrVideoRenderer";
const MAX_VIDEO_SIZE_MB = 99; // Maximum size in MB

export default function Products() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  let loginStoreDetails = useStoreState((state) => state.user);

  let shopDetails = useStoreState((state) => state.shop);

  let updateState = useStoreActions((action) => action.shop.updateStore);

  const { isLoaderStatus = false } = shopDetails.data;

  const [state, setState] = useState({
    screen: "ADD_PRODUCT_DETAILS",
    tabName: "Add Products",
    categoryList: [],
    colors: "",
    quantity: "",
    sizes: "",
    gstPercentage: "",
    barcode: "",
    shippingWeight: "",
    discountPrice: "",
    price: "",
    productName: "",
    productDescription: "",
    category: "",
    products: [],
    isUpload: true,
  });

  const myInputRef = useRef(null);

  const { authToken, existingStoreInfo } = loginStoreDetails.data || {};

  const [isProductsFetchDone, setIsProductsFetchStatus] = useState(false);

  const { businessName = "shopname" } = _.get(
    existingStoreInfo,
    "[0].store",
    {}
  );

  let navigate = useNavigate();

  useEffect(() => {
    getCategoryList();
    fetchListOfExistingProducts();
  }, []);

  let productDetails = useStoreState((state) => state.product);

  const { isLoaderEnabled = false, productList = [] } = productDetails.data;

  let updateProductState = useStoreActions(
    (action) => action.product.updateStore
  );

  const { productImage } = productDetails.data || {};

  const updateAndValidateFormField = (event) => {
    const { name, value } = event.target;

    setState({ ...state, [name]: value });
  };

  const businessStoreURL = `${window.location?.host}/store/${businessName}`;

  const fetchListOfExistingProducts = async () => {
    const productResponse = await fetchProducts({
      storeName: businessName,
      limit: 10,
      page: 1,
    });
    if (_.get(productResponse, "statusCode") == "200") {
      const { products = [] } = productResponse;
      setIsProductsFetchStatus(true);
      setState((previousValues) => ({
        ...previousValues,
        screen:
          _.isEmpty(businessName) || _.isEmpty(products)
            ? "WELCOME"
            : "ADD_PRODUCT_IMAGE",
        products,
      }));
    }
  };

  const handleMaxFileLimitReached = (videoSizeInMB) => {
    alert(`Video size exceeds the 10MB limit. Current size: ${videoSizeInMB.toFixed(2)} MB`);
  }

  const handleFileUpload = async (e) => {
    e.preventDefault();

    const file = e.target.files[0]; // Get the selected file

    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024); // Convert size to MB
    if (fileSizeInMB > MAX_VIDEO_SIZE_MB) {
      // Show an error toast or alert
      handleMaxFileLimitReached(fileSizeInMB)
      return; // Prevent upload
    }

    const formData = new FormData();
    formData.append("image", file);
    await fileUpload(formData);
  };
  const handleRecordedUpload = async (file, ) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
        await fileUpload(formData);
        console.log('File uploaded successfully');
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};

  const fileUpload = async (formData) => {
    try {
      updateState({ isLoaderStatus: true });

      const URL = getServiceURL();

      const response = await fetch(`${URL}/fileupload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const responseJSON = await response.json();
        const productImage = _.get(responseJSON, "imagePath");

        let videoResponse = await axios.post(
          `${URL}/fileupload/extract-video-text`,
          { videoUrl: productImage }
        );

        const {
          message = "",
          transcript = "",
          status = false,
        } = videoResponse?.data || {};

        notification.open({
          type: status ? "success" : "error",
          message: message,
        });

        updateProductState({ productImage, productDescription: transcript });

        updateState({ isLoaderStatus: false });

        notification.open({
          type: "success",
          message: "Product Image uploaded successful!",
        });

        setState({
          ...state,
          screen: "ADD_PRODUCT_DETAILS",
          productDescription: transcript,
        });
      } else {
        notification.open({
          type: "warning",
          message: "Facing issue with image upload!",
        });
      }
    } catch (error) {
    } finally {
      updateState({ isLoaderStatus: false });
    }
  };

  const createProduct = async () => {
    const {
      colors,
      quantity,
      sizes,
      gstPercentage,
      barcode,
      shippingWeight,
      discountPrice,
      price,
      productName,
      category,
      productDescription,
    } = state;
    const payload = {
      productName,
      productDescription,
      categoryType: category,
      price,
      images: [productImage],
      discountPrice,
      inventory: { quantity, sizes: [sizes], colors: [colors] },
      orderDetails: { shippingWeight, barcode, gstPercentage },
    };
    if (
      [
        productName,
        productDescription,
        category,
        price,
        productImage,
        discountPrice,
        quantity,
        sizes,
        colors,
        shippingWeight,
        gstPercentage,
      ].includes("")
    ) {
      return notification.open({
        type: "warning",
        message: "Kindly Provide all the required fields",
      });
    }
    try {
      updateProductState({ isLoaderEnabled: true });
      const response = await fetch(`${getServiceURL()}/product/create`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${authToken}`,
          "content-type": "application/json",
        },
      });
      if (response.ok) {
        await response.json();
        updateProductState({ isLoaderEnabled: false });
        notification.open({
          type: "success",
          message: "Products created successful!",
        });
        updateProductState({});
        setState({ ...state, screen: "PUBLISH", tabName: "Publish" });
        navigate("/product-list");
      }
    } catch (error) {
      notification.open({
        type: "warning",
        message: "Issue while creation products",
      });
    } finally {
      updateProductState({ isLoaderEnabled: false });
    }
  };

  const getCategoryList = async () => {
    try {
      const response = await fetch(`${getServiceURL()}/category`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        const categoryList = _.get(data, "categoryList", []);
        const list = categoryList.map((e) => {
          return { value: e.value, name: e.key };
        });
        setState({
          ...state,
          screen: "WELCOME",
          categoryList: list,
        });
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const renderWelcomeUI = () => {
    return (
      <div>
        <CModal
          alignment="center"
          className="add-product-modal"
          visible={true}
          onClose={() => console.log(false)}
          aria-labelledby="VerticallyCenteredExample"
        >
          <CModalBody>
            <CImage align="center" src={config.CHECK} height={120} />
            <br />
            {renderTitle("Your Online Shop is Ready to Fly", "title")}
            <div className="sub-title">
              Start adding products to your online shop now.
            </div>
            {renderButton({
              name: "Add Products",
              className: "add-products primary-color button btn",
              onClick: () => {
                setState({ ...state, screen: "ADD_PRODUCT_IMAGE" });
              },
              // styles: {}
            })}
            <div className="label">Store Settings</div>
          </CModalBody>
        </CModal>
      </div>
    );
  };

  const blobToFile = (theBlob, fileName = 'video.mp4') => {
    // Ensure the filename ends with .mp4
    if (!fileName.endsWith('.mp4')) {
      fileName += '.mp4';
    }

        // Get the size of the Blob in bytes
        const videoSizeInBytes = theBlob.size; // Size in bytes
        const videoSizeInMB = videoSizeInBytes / (1024 * 1024); // Convert to MB
    
        console.log('Video Size:', videoSizeInBytes, 'bytes');
        console.log('Video Size:', videoSizeInMB.toFixed(2), 'MB'); // Log size in MB

    return new File(
      [theBlob],
      fileName,
      {
        lastModified: new Date().getTime(),
        type: 'video/mp4', // Explicitly set the MIME type to mp4
      }
    );
  };


  const renderADDProductImage = () => {
    return (
      <Fragment className="fragment">
        <CImage style={{marginBottom: 20}} align="center" src={config.LOGO_BLUE} height={75} />
        {renderTitle("Start adding products", "add-product-title")}
        {renderTitle('Only videos under 10MB in size can be uploaded.')}
        {renderTitle("Add Product Video", "add-product-sub-title", false)}

        <div className="addProductDraggerContainer">
          <img className="upload-icon" src={config.UPLOAD_ICON} />
          <label className="addProductDraggerLabel">
            Drag & Drop Files Here
          </label>
          <label
            className="addProductDraggerLabel"
            style={{ marginTop: "-10px" }}
          >
            Or
          </label>
          <div className="position-relative">
            <button>Browse</button>
            <input
              onChange={handleFileUpload}
              className="file-input"
              type="file"
            />
          </div>

          {/* Record Button to toggle recording */}
          <div
            className="button-div"
            onClick={() => setState({ ...state, isUpload: false })}
          >
            Record
          </div>

          {/* <span className="paste-link">Paste Link</span> */}
        </div>

        {/* Conditionally render the video recorder or file upload */}
        {state.isUpload ? (
          // <Fragment>
          //   <CImage
          //     className="fullWidth"
          //     align="center"
          //     src={config.FILE_UPLOAD}
          //     height={200}
          //     onClick={() => {
          //       myInputRef.current.value = "";
          //       myInputRef && myInputRef.current.click();
          //     }}
          //   />
          //   <br></br>
          // </Fragment>
          <></>
        ) : (

<div>
    <VideoRecorder
        isFlipped={true}
        showReplayControls={true}
        type={'video/mp4'}
        onRecordingComplete={async (videoBlob) => {
            const videoSizeInMB = videoBlob.size / (1024 * 1024); // Calculate size in MB

            if (videoSizeInMB > MAX_VIDEO_SIZE_MB) {
                // Show an error toast
                handleMaxFileLimitReached(videoSizeInMB);
                return; // Prevent upload
            }

            handleRecordedUpload(blobToFile(videoBlob));
        }}
    />
</div>
        )}

        <input
          className="hide"
          onChange={(e) => handleFileUpload(e)}
          type="file"
          ref={myInputRef}
        />
        <br></br>
        <div className="button-container">
          {renderButton({
            name: "Add Now",
            className: "addNewProduct",
            loaderStatus: isLoaderStatus,
            onClick: () => {
              if (productImage) {
                setState({ ...state, screen: "ADD_PRODUCT_DETAILS" });
              } else {
                notification.open({
                  type: "error",
                  message: "please upload a valid product video",
                });
              }
            },
          })}
        </div>
      </Fragment>
    );
  };

  const renderProductDetails = () => {
    return (
      <div className="alignCenter flex flexCol w-100">
        <div className="flexRow layout">
          <div className="flex flexCol with20">
            <div>{renderTitle("Product Added!")}</div>
            <div>
              <ImgOrVideoRenderer
                className={"videoTag"}
                src={productImage}
                width={110}
                height={137}
                videoStyles={{ background: "#000", borderRadius: 20 }}
              />
            </div>
          </div>
          <div className="flex flexCol with75">
            <CAccordion className="add-product-details" activeItemKey={1}>
              <CAccordionItem itemKey={1}>
                <CAccordionHeader>
                  {renderTitle("Add Product Details")}
                </CAccordionHeader>
                <CAccordionBody>
                  {renderAddProductInputBox({
                    name: "productName",
                    value: state.productName,
                    required: true,
                    placeholder: "Enter Product Name",
                    className: "add-product-form-field",
                    onChange: updateAndValidateFormField,
                  })}
                  {renderAddProductInputBox({
                    name: "productDescription",
                    value: state.productDescription,
                    required: true,
                    placeholder: "Enter Product Description",
                    className: "add-product-form-field",
                    onChange: updateAndValidateFormField,
                  })}
                  {renderDropdownTwo({
                    className: "with50",
                    name: "category",
                    value: state.category,
                    list: state.categoryList,
                    required: true,
                    className: "add-product-form-field inputAlign",
                    placeholder:
                      "Enter category name (Like Foods, Kids Care etc)",
                    onChange: updateAndValidateFormField,
                  })}
                  <div className="flex position-relative">
                    {renderAddProductInputBox({
                      className: "with50",
                      name: "price",
                      value: state.price,
                      required: true,
                      type: "number",
                      placeholder: "Enter price",
                      className: "add-product-form-field",
                      onChange: updateAndValidateFormField,
                    })}
                    <div className="with20px"></div>
                    {renderAddProductInputBox({
                      className: "with50",
                      name: "discountPrice",
                      required: true,
                      value: state.discountPrice,
                      type: "number",
                      placeholder: "Enter discounted price",
                      className: "add-product-form-field",
                      onChange: updateAndValidateFormField,
                    })}
                    <div className="discount-notice">
                      <p>
                        No discount campaign created currently. you create it
                        later from dashboard after once you open shop and select
                        that from here at next time.
                      </p>
                    </div>
                  </div>
                  <br></br>
                  {renderTitle("Add Inventory (Total Available Items)")}
                  <Col span={12}>
                    {renderAddProductInputBox({
                      name: "quantity",
                      required: true,
                      value: state.quantity,
                      type: "number",
                      placeholder: "Enter quantity",
                      className: "add-product-form-field",
                      onChange: updateAndValidateFormField,
                    })}
                    <div className="flex">
                      {renderDropdown({
                        name: "sizes",
                        required: true,
                        className: "with50",
                        value: state.sizes,
                        list: ["", "1", "2", "3", "4", "5", "6"],
                        placeholder: "Add Sizes",
                        className: "add-product-form-field",
                        onChange: updateAndValidateFormField,
                        hideStar: true,
                      })}
                      <div className="with20px"></div>
                      {renderDropdown({
                        name: "colors",
                        value: state.colors,
                        required: true,
                        className: "with50",
                        list: ["red", "blue", "white"],
                        placeholder: "Add Colors",
                        className: "add-product-form-field",
                        onChange: updateAndValidateFormField,
                        hideStar: true,
                      })}
                    </div>
                  </Col>
                </CAccordionBody>
              </CAccordionItem>
            </CAccordion>

            <CAccordion activeItemKey={1} className="add-product-details">
              <CAccordionItem itemKey={1}>
                <CAccordionHeader>
                  {renderTitle("Order Details")}
                </CAccordionHeader>
                <CAccordionBody>
                  <div className="flex">
                    {renderDropdown({
                      name: "shippingWeight",
                      value: state.shippingWeight,
                      required: true,
                      className: "with50",
                      list: ["1", "2", "3", "4", "5"],
                      placeholder: "Shipment Weight (Kg)",
                      className: "add-product-form-field",
                      onChange: updateAndValidateFormField,
                      hideStar: true,
                    })}
                    <div className="with20px"></div>
                    {renderDropdown({
                      name: "barcode",
                      className: "with50",
                      value: state.barcode,
                      list: [""],
                      placeholder: "Add Barcode",
                      className: "add-product-form-field",
                      onChange: updateAndValidateFormField,
                    })}
                  </div>
                  {renderAddProductInputBox({
                    name: "gstPercentage",
                    value: state.gstPercentage,
                    required: true,
                    type: "number",
                    placeholder: "Enter GST Percentage",
                    className: "add-product-form-field",
                    onChange: updateAndValidateFormField,
                  })}
                </CAccordionBody>
              </CAccordionItem>
            </CAccordion>
          </div>
        </div>
        <div style={{ width: "80%", marginBottom: "4%" }} className="flexEnd">
          {renderButton({
            name: "Preview",
            className: "add-prod-preview-button",
            loaderStatus: isLoaderEnabled,
            onClick: () => {
              createProduct();
            },
          })}
          {renderButton({
            name: "Publish",
            loaderStatus: isLoaderEnabled,
            className: "add-prod-publish-button",
            onClick: () => {
              createProduct();
            },
          })}
        </div>
      </div>
    );
  };

  const renderPreviewButton = () => {
    return (
      <div className="buttonContainer width36">
        <label
          className="buttonLabelContainer"
          onClick={() => navigate("/preview")}
        >
          Preview
        </label>
      </div>
    );
  };

  const renderCreateStoreButton = () => {
    return (
      <div className="buttonContainer width54">
        <label className="buttonLabelContainer" onClick={() => createProduct()}>
          {isLoaderStatus && (
            <div class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          )}
          Publish
        </label>
      </div>
    );
  };

  const renderMobileProductDetails = () => {
    return (
      <div className="flexCol">
        <CAccordion className="fullWidth" alwaysOpen activeItemKey={1}>
          <CAccordionItem itemKey={1}>
            <CAccordionHeader>Add Product Details</CAccordionHeader>
            <CAccordionBody>
              {renderInputBox({
                name: "productName",
                value: state.productName,
                placeholder: "Enter Product Name",
                onChange: updateAndValidateFormField,
                required: true,
              })}
              {renderInputBox({
                name: "productDescription",
                value: state.productDescription,
                placeholder: "Enter Product Description",
                onChange: updateAndValidateFormField,
                required: true,
              })}
              {renderDropdownTwo({
                name: "category",
                value: state.category,
                list: state.categoryList,
                required: true,
                className: "add-product-form-field-select",
                placeholder: "Enter category name",
                onChange: updateAndValidateFormField,
              })}
              {renderInputBox({
                required: true,
                name: "price",
                value: state.price,
                type: "number",
                placeholder: "Enter price",
                onChange: updateAndValidateFormField,
              })}
              {renderInputBox({
                required: true,
                name: "discountPrice",
                value: state.discountPrice,
                type: "number",
                placeholder: "Enter discounted price",
                onChange: updateAndValidateFormField,
              })}
            </CAccordionBody>
          </CAccordionItem>
          <CAccordionItem itemKey={2}>
            <CAccordionHeader>
              Add Order Details <span className="redColor">*</span>
            </CAccordionHeader>
            <CAccordionBody>
              {renderDropdown({
                name: "shippingWeight",
                value: state.shippingWeight,
                required: true,
                list: ["1", "2", "3", "4", "5"],
                placeholder: "Shipment Weight (Kg)",
                onChange: updateAndValidateFormField,
              })}
              {renderDropdown({
                name: "barcode",
                value: state.barcode,
                required: false,
                list: [""],
                placeholder: "Add Barcode",
                onChange: updateAndValidateFormField,
              })}
              {renderInputBox({
                name: "gstPercentage",
                value: state.gstPercentage,
                required: true,
                type: "number",
                placeholder: "Enter GST Percentage",
                onChange: updateAndValidateFormField,
              })}
            </CAccordionBody>
          </CAccordionItem>
          <CAccordionItem itemKey={3}>
            <CAccordionHeader>
              Add Inventory <span className="redColor">*</span>
            </CAccordionHeader>
            <CAccordionBody>
              {renderInputBox({
                name: "quantity",
                value: state.quantity,
                type: "number",
                required: true,
                placeholder: "Enter quantity",
                onChange: updateAndValidateFormField,
              })}
              {renderDropdown({
                name: "sizes",
                value: state.sizes,
                required: true,
                list: ["", "1", "2", "3", "4", "5", "6"],
                placeholder: "Add Sizes",
                onChange: updateAndValidateFormField,
              })}
              {renderDropdown({
                name: "colors",
                value: state.colors,
                required: true,
                list: ["red", "blue", "white"],
                placeholder: "Add Colors",
                onChange: updateAndValidateFormField,
              })}
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>

        <div className="buttonWrapperContainer">
          {renderPreviewButton()}
          {renderCreateStoreButton()}
        </div>
      </div>
    );
  };

  const renderPremiumPage = () => {
    return (
      <div className="flexRow layout justifyContent">
        <div className="premiumLayout">
          <CImage align="center" src={config.LOGO_BLUE} />
        </div>
        <div className="premiumLayout">
          <h4>
            Just Choose your pricing plan <br></br> to Publish Your Shop
          </h4>
          <br></br>
          {renderButton({
            name: "START 14 DAYS FREE TRAIL & PUBLISH",
            onClick: () => {
              navigate("/product-list");
            },
          })}
          <br></br>
          <div className="FORT12">
            Within Trail period you can access.., <br></br> Create Shop, Add
            Product Video, Launch Shop, <br></br> Sell Items, Track Shipping &
            Business Reports etc{" "}
          </div>
          <br></br>
          <div className="BOLD FORT12">
            Try Advanced Features with,{" "}
            <span className="underline">GO PREMIUM</span>
          </div>
        </div>
      </div>
    );
  };

  const renderWelcomePage = () => {
    const showCardView = isProductsFetchDone && !_.isEmpty(state.categoryList);

    return (
      showCardView && (
        <div className="bg-light min-vh-100 w-100 d-flex flex-row align-items-center">
          <CContainer>
            <CRow className="justify-content-center">
              <CCol md={4}>
                <CCardGroup>
                  <CCard className="px-4 py-2">
                    <CCardBody>
                      <CForm>
                        {state.screen === "WELCOME" && renderWelcomeUI()}
                        {state.screen === "ADD_PRODUCT_IMAGE" &&
                          renderADDProductImage()}
                      </CForm>
                    </CCardBody>
                  </CCard>
                </CCardGroup>
              </CCol>
            </CRow>
          </CContainer>
        </div>
      )
    );
  };

  const renderDeskTopVersion = () => {
    return (
      <Fragment>
        {["WELCOME", "ADD_PRODUCT_IMAGE"].includes(state.screen) &&
          renderWelcomePage()}
        <div className="flex justifyContent">
          {["ADD_PRODUCT_DETAILS"].includes(state.screen) &&
            renderProductDetails()}
          {["PREMIUM"].includes(state.screen) && renderPremiumPage()}
        </div>
      </Fragment>
    );
  };

  const renderPublishScreen = () => {
    return (
      <div className="mobileLoginLayout">
        <div className="publishContainer">
          <div className="publishLabel">
            <label>Video Published to store! </label>
          </div>

          <div className="storeURLContainer">
            <div className="urlAddressLabel">{`Address :  `} </div>
            <div className="storeURLLabel">{` ${businessStoreURL}`}</div>
          </div>

          <div className="shareEntryContainer">
            <div className="shareButtonContainer">
              <label className="shareButtonLabel">Share Link</label>
              <img className="shareButtonIcon" src={config.SHARE_ICON} />
            </div>

            <div className="shareButtonContainer">
              <label className="shareButtonLabel">Visit Site</label>
              <img className="shareButtonIcon" src={config.EYE_ICON} />
            </div>

            <div className="shareButtonContainer">
              <label className="shareButtonLabel width100">
                Connect Domain
              </label>
            </div>
          </div>
        </div>

        <AppFooter
          topLevelButtonText={"Go to Dashboard"}
          topLevelButtonAction={() => navigate("/home")}
          secondaryButtonText={"GO PREMIUM"}
          secondaryButtonAction={() => navigate("/pricing-list")}
        />
      </div>
    );
  };

  const renderMobileVersion = () => {
    return (
      <Fragment>
        <div className="mobileLoginLayout">
          {(_.isEmpty(businessName) || _.isEmpty(state.products)) &&
            MobileTabUI(state.tabName)}
          {["WELCOME", "ADD_PRODUCT_IMAGE"].includes(state.screen) &&
            renderWelcomePage()}
          <div className="flex justifyContent fullWidth">
            {["ADD_PRODUCT_DETAILS"].includes(state.screen) &&
              renderMobileProductDetails()}
            {["PUBLISH"].includes(state.screen) && renderPublishScreen()}
            {["PREMIUM"].includes(state.screen) && renderPremiumPage()}
          </div>
        </div>
      </Fragment>
    );
  };

  return (
    <>
      {" "}
      <div>
        <div className={`body flex-grow-1`}>
          <Toaster position="top-right" reverseOrder={false} />
          {windowWidth <= 768 ? renderMobileVersion() : renderDeskTopVersion()}
        </div>
      </div>
    </>
  );
}
