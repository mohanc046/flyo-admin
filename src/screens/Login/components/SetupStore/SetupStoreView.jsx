import React from "react";
import UploadVideo from "../../../AddProduct/components/UploadVideoStep";
import ProductDetails from "./components/ProductDetailsStep";
import Done from "./components/DoneStep";
import { useAddProduct } from "../../../AddProduct/_hooks/useAddProduct";
import ComponentCard from "../../../../components/ComponentsCard/ComponentCard";
import Steps from "../../../../components/Steps/Steps";
import StoreDetails from "./components/StoreDetails";

const AddProduct = () => {
  const {
    storeDetailsStepValidation,
    uploadStepValidation,
    detailsStepValidation,
    createProduct,
    activeStep,
    setActiveStep,
    updateStore,
    mainState
  } = useAddProduct();

  const steps = [
    {
      name: "Store Setup",
      component: <StoreDetails updateStore={updateStore} setActiveStep={setActiveStep} />,
      validate: () => storeDetailsStepValidation(),
      hideBackButton: true
    },
    {
      name: "Upload Product Video",
      component: <UploadVideo updateStore={updateStore} setActiveStep={setActiveStep} />,
      validate: () => uploadStepValidation(),
      hideBackButton: true
    },
    {
      name: "Add Details",
      component: <ProductDetails updateStore={updateStore} mainState={mainState} />,
      validate: () => detailsStepValidation()
    },
    {
      name: "Done",
      component: <Done createProduct={createProduct} />,
      validate: () => null,
      hideBackButton: true,
      hideNextButon: true
    }
  ];

  return (
    <div className="p-2 p-sm-3 p-md-4 p-lg-5 overflow-hidden">
      <ComponentCard>
        <Steps steps={steps} activeStep={activeStep} setActiveStep={setActiveStep} />
      </ComponentCard>
    </div>
  );
};

export default AddProduct;
