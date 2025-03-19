import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTitle } from "../../../store/reducers/headerTitleSlice";
import { showToast } from "../../../store/reducers/toasterSlice";
import { formatDomainName, getServiceURL, processAndUploadVideo } from "../../../utils/utils";
import { hideSpinner, showSpinner } from "../../../store/reducers/spinnerSlice";
import { getAuthToken } from "../../../utils/_hooks";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { INITIAL_STATE } from "../../Login/login.constants";
import axios from "axios";
import { uploadToS3 } from "../../../utils/awsConfig";

export const useAddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mainState, setMainState] = useState({});
  const [activeStep, setActiveStep] = useState(0);

  const updateStore = (newData) => {
    setMainState((prevState) => ({
      ...prevState,
      ...newData
    }));
  };

  useEffect(() => {
    dispatch(setTitle("Add Product"));
  }, []);

  const storeDetailsStepValidation = async () => {
    const fields = [
      { field: mainState.country, message: "Country is required." },
      { field: mainState.businessName, message: "Business Name is required." },
      { field: mainState.businessType, message: "Business Type is required." }
    ];

    for (const { field, message } of fields) {
      if (!field) {
        dispatch(
          showToast({
            type: "error",
            title: "Error",
            message
          })
        );
        return false;
      }
    }

    return await initiateStoreCreation();
  };

  const createStore = async ({ currency }) => {
    try {
      dispatch(showSpinner());
      const URL = getServiceURL();

      const response = await fetch(`${URL}/store/create`, {
        method: "POST",
        body: JSON.stringify({
          location: mainState.country,
          businessName: mainState.businessName,
          businessType: [mainState.businessType],
          currency
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const responseData = await response.json();
      const { data } = responseData || {};
      const { message = "Store creation successful!" } = data || {};

      if (response.status === 200) {
        dispatch(showToast({ type: "success", title: "Success", message: message }));

        localStorage.setItem(
          "storeInfo",
          JSON.stringify({
            store: {
              businessName: mainState.businessName,
              domainName: formatDomainName(mainState.businessName),
              businessType: [mainState.businessType],
              location: mainState.country
            }
          })
        );

        dispatch(hideSpinner());

        return true;
      } else {
        dispatch(hideSpinner());
        dispatch(showToast({ type: "warning", title: "Warning", message: message }));
        return false;
      }
    } catch (error) {
      dispatch(hideSpinner());
      dispatch(
        showToast({
          type: "error",
          title: "Error",
          message: `Error while creating the store: ${error}`
        })
      );
      return false;
    } finally {
      dispatch(hideSpinner());
    }
  };

  const initiateStoreCreation = async () => {
    if (![mainState.businessType, mainState.businessName, mainState.country].includes("")) {
      const currencyIndex = _.findIndex(
        INITIAL_STATE.countryList,
        (countryName) => countryName === mainState.country
      );

      const currency = INITIAL_STATE.currencyList[currencyIndex];
      return await createStore({ currency });
    } else {
      dispatch(
        showToast({
          type: "warning",
          description: "Kindly provide all the required fields."
        })
      );
      return false;
    }
  };

  // const uploadStepValidation = () => {
  //   if (!mainState.productImage) {
  //     dispatch(
  //       showToast({
  //         type: "error",
  //         title: "Error",
  //         message: "Product Image is required"
  //       })
  //     );
  //     return true;
  //   }
  //   return false;
  // };

  const uploadStepValidation = async () => {
    try {
      dispatch(showSpinner());
      const URL = getServiceURL();
      // Extract the file from FormData
      const file = mainState?.videoUrl.get("image");
      // Upload to S3

      const productImage = await processAndUploadVideo(file);

      let transcript = "";

      try {
        const videoResponse = await axios.post(
          `${URL}/fileupload/extract-video-text`,
          {
            videoUrl: productImage
          },
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`
            }
          }
        );

        transcript = videoResponse?.data?.transcript || ""; // Use empty string if no transcript is returned
      } catch (extractionError) {
        console.warn("Video extraction failed:", extractionError);
        dispatch(
          showToast({
            type: "error",
            title: "Error",
            message: "Video extraction failed. Continuing with default values."
          })
        );
      }

      updateStore({
        productDescription: transcript,
        productImage: productImage
      });

      // Automatically move to the next step after upload
      setActiveStep((prevStep) => prevStep + 1);
      dispatch(hideSpinner());
    } catch (error) {
      dispatch(hideSpinner());
      console.error("Error uploading file:", error);
      showToast({
        type: "error",
        title: "Error",
        message: "An error occurred while uploading the file."
      });
    } finally {
      dispatch(hideSpinner());
    }
  };

  const detailsStepValidation = () => {
    const fields = [
      { field: mainState.productName, message: "Product Name is required." },
      { field: mainState.productDescription, message: "Product Description is required." },
      { field: mainState.productCategory, message: "Product category is required." },
      { field: mainState.price, message: "Price is required." },
      { field: mainState.discountedPrice, message: "Discount Price is required." },
      { field: mainState.quantity, message: "Quantity is required." },
      { field: mainState.sizes, message: "Sizes is required." },
      { field: mainState.colors, message: "Colors is required." },
      { field: mainState.shipmentWeight, message: "Shipment Weight is required." },
      { field: mainState.gstPercentage, message: "GST Percentage is required." }
    ];

    for (const { field, message } of fields) {
      if (!field) {
        dispatch(
          showToast({
            type: "error",
            title: "Error",
            message
          })
        );
        return false;
      }
    }
    return true;
  };

  const createProduct = async () => {
    const payload = {
      productName: mainState.productName,
      productDescription: mainState.productDescription,
      categoryType: mainState.productCategory,
      price: mainState.price,
      images: [mainState.productImage],
      discountPrice: mainState.discountedPrice || "",
      inventory: {
        quantity: mainState.quantity,
        sizes: [mainState.sizes],
        colors: [mainState.colors]
      },
      orderDetails: {
        shippingWeight: mainState.shipmentWeight,
        barcode: mainState.barcode || "",
        gstPercentage: mainState.gstPercentage
      }
    };

    try {
      dispatch(showSpinner());
      const response = await fetch(`${getServiceURL()}/product/create`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "content-type": "application/json"
        }
      });
      if (response.ok) {
        await response.json();
        dispatch(hideSpinner());
        dispatch(
          showToast({
            type: "success",
            title: "Success",
            message: "Products created successful!"
          })
        );
        setTimeout(() => {
          navigate("/product-list");
        }, 2000);
      }
    } catch (error) {
      dispatch(
        showToast({
          type: "error",
          title: "Error",
          message: "Issue while creation products"
        })
      );
    } finally {
      dispatch(hideSpinner());
    }
  };

  return {
    storeDetailsStepValidation,
    uploadStepValidation,
    detailsStepValidation,
    createProduct,
    activeStep,
    setActiveStep,
    updateStore,
    mainState
  };
};
