import React, { useState } from "react";
import { Stepper, Step, StepLabel, Button, Typography } from "@mui/material";
import "./Steps.scss";

const Steps = ({ steps, activeStep, setActiveStep }) => {
  const [error, setError] = useState("");

  const handleNext = async () => {
    setError(""); // Clear previous error messages
    const validate = steps[activeStep]?.validate;

    if (typeof validate === "function") {
      // Ensure validate is a function
      try {
        const validationResult = await validate(); // Await async validations
        console.log("Validation Result:", validationResult); // Debugging log

        if (validationResult !== true) {
          return;
        }
      } catch (error) {
        setError("Validation failed. Please check your inputs."); // Handle any errors from validation
        return;
      }
    }

    // Move to the next step only if validation passed
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setError(""); // Clear error when navigating back
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setError(""); // Clear error on reset
    setActiveStep(0);
  };

  return (
    <div className="example">
      <div className="step-progress">
        <Stepper activeStep={activeStep}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel>{step.name || `Step ${index + 1}`}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div className="step-content">
          {activeStep === steps.length ? (
            <div>
              <Typography>All steps completed</Typography>
              <Button onClick={handleReset} variant="outlined">
                Reset
              </Button>
            </div>
          ) : (
            <div>
              {error && <Typography color="red">{error}</Typography>}
              <Typography>{steps[activeStep]?.component || "No content"}</Typography>
              <div className="step-actions">
                <Button
                  disabled={activeStep === 0 || steps[activeStep]?.hideBackButton}
                  onClick={handleBack}
                  variant="outlined">
                  Back
                </Button>

                <Button
                  onClick={handleNext}
                  variant="contained"
                  disabled={steps[activeStep]?.hideNextButon}>
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Steps;
