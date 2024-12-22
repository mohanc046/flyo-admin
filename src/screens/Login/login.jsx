import React, { useState } from "react";
import { Button, Label, FormGroup, Container, Row, Col, Card, CardBody } from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { ReactComponent as LeftBg } from "../../assets/images/bg/login-bgleft.svg";
import { ReactComponent as RightBg } from "../../assets/images/bg/login-bg-right.svg";
import Logo from "../../layouts/logo/Logo";
import GoogleOAuthLogin from "../../components/SignInButton/google";
import FacebookOAuthLogin from "../../components/SignInButton/facebook";
import "./login.css";
import { CImage } from "@coreui/react";
import { config } from "../../config";
import OTPView from "./components/OTPView.jsx";
import CreatestoreView from "./components/SetupStore/SetupStoreView.jsx";

const INITIAL_STATE = {
  email: "",
  otp: "",
  businessName: "",
  businessType: "",
  country: "",
  isLoaderStatus: false,
  isLoaderEnabled: false,
  countryList: ["India", "USA", "China", "Australia", "United Kingdom", "Indonesia"],
  currencyList: ["INR", "USD", "CNY", "AUD", "GBP", "IDR"]
};

const Login = () => {
  const navigate = useNavigate();

  const [state, setState] = useState({
    screen: "LOGIN",
    title: "Get Started with Flayashop",
    email: "",
    otp: null
  });

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email is invalid").required("Email is required")
  });

  return (
    <div className="loginBox">
      <LeftBg className="position-absolute left bottom-0" />
      <RightBg className="position-absolute end-0 top" />
      <Container fluid className="h-100">
        <Row className="justify-content-center align-items-center h-100">
          {state.screen === "CREATE_STORE" ? (
            <Col lg="12">
              <CreatestoreView state={state} />
            </Col>
          ) : (
            <Col lg="12" className="loginContainer">
              <Card className="d-flex align-items-center p-3 bg-white rounded">
                <div>
                  <Logo />
                  <h4 className="mb-3 fw-semibold">{state.title}</h4>
                </div>
                {state.screen === "LOGIN" && (
                  <CardBody className="p-4 m-1">
                    <Formik
                      initialValues={INITIAL_STATE}
                      validationSchema={validationSchema}
                      onSubmit={(fields) => {
                        setState({
                          title: "Enter your verification code",
                          screen: "OTP",
                          email: fields.email
                        });
                      }}
                      render={({ errors, touched }) => (
                        <Form>
                          <FormGroup>
                            <Label htmlFor="email">Email</Label>
                            <Field
                              name="email"
                              type="text"
                              className={`form-control${
                                errors.email && touched.email ? " is-invalid" : ""
                              }`}
                            />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="invalid-feedback"
                            />
                          </FormGroup>
                          <FormGroup>
                            <Button type="submit" color="primary" className="me-2">
                              Login
                            </Button>
                          </FormGroup>
                        </Form>
                      )}
                    />
                    <div class="d-flex flex-column align-items-center text-center my-3">
                      <h5 class="mb-2">Or</h5>
                      <h5 class="mb-3">Get started with</h5>
                      <div class="d-flex justify-content-center gap-3">
                        <span>
                          <CImage align="center" src={config.APPLE} height={50} width={50} />
                        </span>
                        <span>
                          <GoogleOAuthLogin />
                        </span>
                        <span>
                          <FacebookOAuthLogin />
                        </span>
                      </div>
                    </div>
                  </CardBody>
                )}

                {state.screen === "OTP" && <OTPView state={state} />}
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Login;
