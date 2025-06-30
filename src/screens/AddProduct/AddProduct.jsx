import React from "react";
import UploadVideo from "./components/UploadVideoStep";
import ProductDetails from "./components/ProductDetailsStep";
import Done from "./components/DoneStep";
import ComponentCard from "../../components/ComponentsCard/ComponentCard";
import Steps from "../../components/Steps/Steps";
import { useAddProduct } from "./_hooks/useAddProduct";

const AddProduct = () => {
  const {
    uploadStepValidation,
    detailsStepValidation,
    activeStep,
    setActiveStep,
    updateStore,
    mainState
  } = useAddProduct();

  const steps = [
    {
      name: "Upload Video",
      component: <UploadVideo updateStore={updateStore} setActiveStep={setActiveStep} />, // Pass setActiveStep
      validate: () => uploadStepValidation() // Pass as a function reference
    },
    {
      name: "Add Details",
      component: <ProductDetails updateStore={updateStore} mainState={mainState} />,
      validate: () => detailsStepValidation() // Pass as a function reference
    },
    {
      name: "Done",
      component: <Done />,
      validate: () => null,
      hideBackButton: true,
      hideNextButon: true
    }
  ];

  return (
    <div className="p-2 p-sm-3 p-md-4 p-lg-5">
      <ComponentCard>
        <Steps steps={steps} activeStep={activeStep} setActiveStep={setActiveStep} />
      </ComponentCard>
    </div>
  );
};

export default AddProduct;
