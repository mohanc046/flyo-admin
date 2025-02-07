import React from "react";
import OTPInput from "react-otp-input";
import { Button, CardBody } from "reactstrap";

const OTPView = ({ state, verifyOTP, navigateToDashboard, setState }) => {
  return (
    <CardBody className="d-flex flex-column justify-content-center align-items-center m-0 p-0">
      <h6>Enter the 4-digit code we have sent to</h6>
      <h6>{`${state.email}`}</h6>
      <div className="otp-container d-flex justify-content-center mt-4">
        <OTPInput
          value={state.otp}
          numInputs={4}
          onChange={(value) =>
            setState((prevState) => ({
              ...prevState,
              otp: value
            }))
          }
          renderSeparator={<span> </span>}
          renderInput={(props) => <input name="otp" {...props} />}
        />
      </div>
      <div className="d-flex justify-content-center mt-3">
        <Button
          color="primary"
          className="w-100 mt-3 mb-3"
          onClick={() => verifyOTP({ state, navigateToDashboard })}>
          Verify
        </Button>
      </div>
      <h6>Didn't receive the code?</h6>
      <h6 className="cursor-pointer fw-semibold text-decoration-underline">Resend Code</h6>
    </CardBody>
  );
};

export default OTPView;
