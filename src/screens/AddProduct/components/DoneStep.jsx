import React, { useEffect } from "react";
import Lottie from "lottie-react";
import successAnimation from "../../../assets/lottie/success.json";

const DoneStep = ({ createProduct }) => {
  useEffect(() => {
    createProduct();
  }, [createProduct]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Lottie animationData={successAnimation} loop={true} style={{ width: 300, height: 300 }} />
    </div>
  );
};

export default DoneStep;
