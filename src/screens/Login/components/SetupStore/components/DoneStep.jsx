import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import successAnimation from "../../../../../assets/lottie/success.json";

const DoneStep = ({ createProduct }) => {
  const navigate = useNavigate();

  useEffect(() => {
    createProduct();
  }, [navigate, createProduct]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Lottie animationData={successAnimation} loop={true} style={{ width: 300, height: 300 }} />
    </div>
  );
};

export default DoneStep;
