import _ from "lodash";
import React, { Fragment, useState, useRef, useEffect } from "react";
import { CCard, CCardBody, CCardGroup, CCol, CContainer, CForm, CRow, CImage } from "@coreui/react";
import { CAccordion, CAccordionItem, CAccordionBody, CAccordionHeader } from "@coreui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStoreState, useStoreActions } from "../../store/hooks";
import { Toaster } from "react-hot-toast";
import { config } from "../../config";
import {
  renderTitle,
  renderButton,
  emptySpace,
  renderDropdown,
  renderInputBox,
  renderDropdownTwo,
  RenderEditProductViewMobileTabUI
} from "../../utils/utilsUI";
import "./edit-product.css";
import axios from "axios";
import { getServiceURL } from "../../utils";
import { notification } from "antd";
import VideoRecorder from "react-video-recorder";
import ImgOrVideoRenderer from "../../components/ImgOrVideoRenderer/ImgOrVideoRenderer";

export default function EditProduct() {
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

  const { state: propsState } = useLocation();

  const { isLoaderStatus = false } = shopDetails.data;

  const [state, setState] = useState({
    screen: "",
    tabName: "Edit Product",
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
    productImage: "",
    productId: ""
  });

  useEffect(() => {
    const {
      discountPrice,
      inventory,
      item,
      orderDetails,
      originalPrice,
      productDescription,
      category,
      image,
      _id
    } = propsState || {};

    const { colors, quantity, sizes } = inventory || {};

    const { barcode, shippingWeight, gstPercentage } = orderDetails || {};

    setState((previousState) => {
      return {
        ...previousState,
        discountPrice,
        colors: _.get(colors, "[0]"),
        quantity: quantity,
        sizes: _.get(sizes, "[0]"),
        productDescription,
        productName: item,
        price: originalPrice,
        barcode,
        shippingWeight,
        gstPercentage,
        productImage: image,
        category,
        productId: _id
      };
    });
  }, [propsState]);

  const { productImage = "" } = state;

  const myInputRef = useRef(null);

  const { authToken, existingStoreInfo } = loginStoreDetails.data || {};

  const [isProductsFetchDone, setIsProductsFetchStatus] = useState(false);

  const { businessName = "shopname" } = _.get(existingStoreInfo, "[0].store", {});

  let navigate = useNavigate();

  useEffect(() => {
    getCategoryList();
  }, []);

  let productDetails = useStoreState((state) => state.product);

  const { isLoaderEnabled = false } = productDetails.data;

  let updateProductState = useStoreActions((action) => action.product.updateStore);

  const updateAndValidateFormField = (event) => {
    const { name, value } = event.target;

    setState({ ...state, [name]: value });
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    await fileUpload(formData);
  };

  const handleRecordedUpload = async (file) => {
    const recordedFile = new File([file], "recorded-video.webm", {
      type: "video/webm"
    });

    const formData = new FormData();
    formData.append("image", recordedFile);

    try {
      await fileUpload(formData);
      console.log("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
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
          Authorization: `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const responseJSON = await response.json();
        const productImage = _.get(responseJSON, "imagePath");

        let videoResponse = await axios.post(`${URL}/fileupload/extract-video-text`, {
          videoUrl: productImage
        });

        const { message = "", transcript = "", status = false } = videoResponse?.data || {};

        notification.open({ type: status ? "success" : "error", message: message });

        updateProductState({ productImage, productDescription: transcript });

        updateState({ isLoaderStatus: false });

        notification.open({ type: "success", message: "Product Image uploaded successful!" });

        setState({ ...state, screen: "ADD_PRODUCT_DETAILS", productDescription: transcript });
      } else {
        notification.open({ type: "warning", message: "Facing issue with image upload!" });
      }
    } catch (error) {
    } finally {
      updateState({ isLoaderStatus: false });
    }
  };

  const getCategoryList = async () => {
    try {
      const response = await fetch(`${getServiceURL()}/category`, {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        const categoryList = _.get(data, "categoryList", []);
        const list = categoryList.map((e) => {
          return { value: e.value, name: e.key };
        });
        setState((previousState) => {
          return {
            ...previousState,
            categoryList: list
          };
        });
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const updateProduct = async () => {
    try {
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
        productId
      } = state;

      const payload = {
        productName,
        productDescription,
        categoryType: category,
        price,
        images: [productImage],
        discountPrice,
        inventory: { quantity, sizes: [sizes], colors: [colors] },
        orderDetails: { shippingWeight, barcode, gstPercentage }
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
          gstPercentage
        ].includes("")
      ) {
        return notification.open({
          type: "warning",
          message: "Kindly Provide all the required fields"
        });
      }

      updateProductState({ isLoaderEnabled: true });

      setState((previousState) => {
        return { ...previousState, isLoaderEnabled: true };
      });

      const response = await axios.post(`${getServiceURL()}/product/update`, {
        payload: { ...payload },
        _id: productId
      });

      if (response?.data?.statusCode === 200) {
        updateProductState({ isLoaderEnabled: false });

        notification.open({ type: "success", message: "Product Updated successful!" });

        updateProductState({});

        return navigate("/product-list");
      }
    } catch (error) {
      notification.open({ type: "warning", message: "Issue while update products" });
    } finally {
      setState((previousState) => {
        return { ...previousState, isLoaderEnabled: false };
      });

      updateProductState({ isLoaderEnabled: false });
    }
  };

  const blobToFile = (theBlob, fileName) => {
    return new File(
      [theBlob], // no need to cast to 'any' in TypeScript
      fileName,
      {
        lastModified: new Date().getTime(),
        type: theBlob.type
      }
    );
  };

  const renderADDProductImage = () => {
    return (
      <Fragment>
        <CImage align="center" src={config.LOGO_BLUE} height={75} />
        <br />
        {renderTitle("Start adding products")}
        <div className="FORT12">
          This is a three step process, and it starts by capturing what the product is.
        </div>
        {emptySpace()}
        {renderTitle("Add Product Video", "", true)}
        <CImage
          className="fullWidth"
          align="center"
          src={config.FILE_UPLOAD}
          height={200}
          onClick={() => {
            myInputRef.current.value = "";
            myInputRef && myInputRef.current.click();
          }}
        />
        <br></br>
        <h4 className="BOLD textCenter">OR</h4>
        <div>
          <VideoRecorder
            isFlipped={true}
            showReplayControls={true}
            onRecordingComplete={async (videoBlob) => {
              // Do something with the video...
              handleRecordedUpload(blobToFile(videoBlob));
            }}
          />
        </div>
        <input
          className="hide"
          onChange={(e) => handleFileUpload(e)}
          type="file"
          ref={myInputRef}
        />
        <br></br>
        {renderButton({
          name: "Add Now",
          loaderStatus: isLoaderStatus,
          onClick: () => {
            if (productImage) {
              setState({ ...state, screen: "ADD_PRODUCT_DETAILS" });
            } else {
              notification.open({ type: "error", message: "please upload product image" });
            }
          }
        })}
        {emptySpace()}
      </Fragment>
    );
  };

  const renderProductDetails = () => {
    return (
      <div className="flexRow edit-layout">
        <div className="flex flexCol with20">
          <div>{renderTitle("Edit Product!")}</div>
          <ImgOrVideoRenderer
            className={"videoTag"}
            src={productImage}
            width={152}
            height={167}
            videoStyles={{ background: "#000", borderRadius: 20 }}
          />
        </div>
        <div className="flex flexCol with75">
          {renderTitle("Details", "", true)}
          {renderInputBox({
            name: "productName",
            value: state.productName,
            required: true,
            placeholder: "Enter Product Name",
            onChange: updateAndValidateFormField
          })}
          {renderInputBox({
            name: "productDescription",
            value: state.productDescription,
            required: true,
            placeholder: "Enter Product Description",
            onChange: updateAndValidateFormField
          })}
          {renderDropdownTwo({
            name: "category",
            value: state.category,
            list: state.categoryList,
            required: true,
            placeholder: "Enter category name",
            onChange: updateAndValidateFormField
          })}
          <div className="flex">
            {renderInputBox({
              className: "with50",
              name: "price",
              value: state.price,
              required: true,
              type: "number",
              placeholder: "Enter price",
              onChange: updateAndValidateFormField
            })}
            <div className="with20px"></div>
            {renderInputBox({
              className: "with50",
              name: "discountPrice",
              required: true,
              value: state.discountPrice,
              type: "number",
              placeholder: "Enter discounted price",
              onChange: updateAndValidateFormField
            })}
          </div>
          <br></br>
          {renderTitle("Add Inventory (Total Available Items)", "", true)}
          {renderInputBox({
            name: "quantity",
            required: true,
            value: state.quantity,
            type: "number",
            placeholder: "Enter quantity",
            onChange: updateAndValidateFormField
          })}
          <div className="flex">
            {renderDropdown({
              name: "sizes",
              required: true,
              className: "with50",
              value: state.sizes,
              list: ["", "1", "2", "3", "4", "5", "6"],
              placeholder: "Add Sizes",
              onChange: updateAndValidateFormField
            })}
            <div className="with20px"></div>
            {renderDropdown({
              name: "colors",
              value: state.colors,
              required: true,
              className: "with50",
              list: ["red", "blue", "white"],
              placeholder: "Add Colors",
              onChange: updateAndValidateFormField
            })}
          </div>
          <br></br>
          {renderTitle("Order Details", "", true)}
          <div className="flex">
            {renderDropdown({
              name: "shippingWeight",
              value: state.shippingWeight,
              required: true,
              className: "with50",
              list: ["1", "2", "3", "4", "5"],
              placeholder: "Shipment Weight (Kg)",
              onChange: updateAndValidateFormField
            })}
            <div className="with20px"></div>
            {renderDropdown({
              name: "barcode",
              className: "with50",
              value: state.barcode,
              list: [""],
              placeholder: "Add Barcode",
              onChange: updateAndValidateFormField
            })}
          </div>
          {renderInputBox({
            name: "gstPercentage",
            value: state.gstPercentage,
            required: true,
            type: "number",
            placeholder: "Enter GST Percentage",
            onChange: updateAndValidateFormField
          })}
          <br></br>
          <div className="flexEnd">
            <div className="with20">
              {renderButton({
                name: "Update",
                loaderStatus: state.isLoaderEnabled,
                onClick: () => {
                  updateProduct();
                }
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPreviewButton = () => {
    return (
      <div className="buttonContainer width36">
        <label className="buttonLabelContainer" onClick={() => navigate("/preview")}>
          Preview
        </label>
      </div>
    );
  };

  const renderCreateStoreButton = () => {
    return (
      <div className="buttonContainer width54">
        <label className="buttonLabelContainer" onClick={() => updateProduct()}>
          {state.isLoaderEnabled && (
            <div class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          )}
          Update
        </label>
      </div>
    );
  };

  const renderMobileProductDetails = () => {
    return (
      <div className="flexCol">
        <CAccordion className="fullWidth" alwaysOpen activeItemKey={1}>
          <CAccordionItem itemKey={1}>
            <CAccordionHeader>
              Add Product Details <span className="redColor">*</span>
            </CAccordionHeader>
            <CAccordionBody>
              {renderInputBox({
                name: "productName",
                value: state.productName,
                placeholder: "Enter Product Name",
                onChange: updateAndValidateFormField,
                required: true
              })}
              {renderInputBox({
                name: "productDescription",
                value: state.productDescription,
                placeholder: "Enter Product Description",
                onChange: updateAndValidateFormField,
                required: true
              })}
              {renderDropdownTwo({
                name: "category",
                value: state.category,
                list: state.categoryList,
                required: true,
                placeholder: "Enter category name",
                onChange: updateAndValidateFormField
              })}
              {renderInputBox({
                required: true,
                name: "price",
                value: state.price,
                type: "number",
                placeholder: "Enter price",
                onChange: updateAndValidateFormField
              })}
              {renderInputBox({
                required: true,
                name: "discountPrice",
                value: state.discountPrice,
                type: "number",
                placeholder: "Enter discounted price",
                onChange: updateAndValidateFormField
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
                onChange: updateAndValidateFormField
              })}
              {renderDropdown({
                name: "barcode",
                value: state.barcode,
                required: false,
                list: [""],
                placeholder: "Add Barcode",
                onChange: updateAndValidateFormField
              })}
              {renderInputBox({
                name: "gstPercentage",
                value: state.gstPercentage,
                required: true,
                type: "number",
                placeholder: "Enter GST Percentage",
                onChange: updateAndValidateFormField
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
                onChange: updateAndValidateFormField
              })}
              {renderDropdown({
                name: "sizes",
                value: state.sizes,
                required: true,
                list: ["", "1", "2", "3", "4", "5", "6"],
                placeholder: "Add Sizes",
                onChange: updateAndValidateFormField
              })}
              {renderDropdown({
                name: "colors",
                value: state.colors,
                required: true,
                list: ["red", "blue", "white"],
                placeholder: "Add Colors",
                onChange: updateAndValidateFormField
              })}
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>

        <div className="buttonWrapperContainer">
          {/* {renderPreviewButton()} */}
          {renderCreateStoreButton()}
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
                  <CCard className="p-4">
                    <CCardBody>
                      <CForm>{renderADDProductImage()}</CForm>
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
        {["WELCOME", "ADD_PRODUCT_IMAGE"].includes(state.screen) && renderWelcomePage()}
        <div className="flex justifyContent">{renderProductDetails()}</div>
      </Fragment>
    );
  };

  const renderMobileVersion = () => {
    return (
      <Fragment>
        <div className="mobileLoginLayout">
          {RenderEditProductViewMobileTabUI(state.tabName)}
          <div className="flex justifyContent fullWidth">{renderMobileProductDetails()}</div>
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
