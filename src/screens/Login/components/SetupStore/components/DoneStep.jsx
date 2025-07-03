import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import successAnimation from "../../../../../assets/lottie/success.json";

const DoneStep = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Lottie animationData={successAnimation} loop={true} style={{ width: 300, height: 300 }} />
    </div>
  );
};

export default DoneStep;
