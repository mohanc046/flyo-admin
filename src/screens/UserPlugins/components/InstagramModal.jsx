import React, { useState } from "react";
import { Col, Row, Form, FormGroup, Label, Button, Input, ModalBody } from "reactstrap";
import { config } from "../../../config";
import { useDispatch } from "react-redux";
import { showToast } from "../../../store/reducers/toasterSlice";
import axios from "axios";
import { getServiceURL } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import { hideSpinner, showSpinner } from "../../../store/reducers/spinnerSlice";
import instaLogo from "../../../assets/images/insta.png";

const InstagramModal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState({
    instagramAccountId: "",
    accessToken: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const configurePlugin = async (e) => {
    e.preventDefault();

    try {
      dispatch(showSpinner());
      const storeInfo = JSON.parse(localStorage.getItem("storeInfo"));
      if (!storeInfo || !storeInfo.store || !storeInfo.store.domainName) {
        throw new Error("Invalid store information.");
      }

      const storeName = storeInfo.store.domainName;

      const requestPayload = {
        pluginType: "INSTAGRAM",
        instagramAccountId: formValues.instagramAccountId,
        accessToken: formValues.accessToken,
        isActive: true
      };

      const response = await axios.put(
        `${getServiceURL()}/store/plugin/config/${storeName}`,
        requestPayload
      );

      const { statusCode = 500, message = "Issue while updating plugin config!" } =
        response.data || {};

      if (statusCode === 200) {
        const updatedStoreInfo = {
          ...storeInfo,
          store: {
            ...storeInfo.store,
            pluginConfig: {
              ...storeInfo.store.pluginConfig,
              instagram: requestPayload
            }
          }
        };

        localStorage.setItem("storeInfo", JSON.stringify(updatedStoreInfo));
        dispatch(
          showToast({
            type: "success",
            title: "Success",
            message: "Instagram plugin configured successfully!"
          })
        );
        dispatch(hideSpinner());
        navigate("/home");
      } else {
        dispatch(hideSpinner());
        notification.open({ type: "warning", message });
      }
    } catch (error) {
      console.error("Error configuring plugin:", error.message || error);
      dispatch(
        showToast({ type: "error", title: "Error", message: "Issue while configuring plugin!" })
      );
      dispatch(hideSpinner());
    }
  };

  return (
    <Form onSubmit={configurePlugin}>
      <ModalBody>
        <Row>
          <Col md={6} className="text-center">
            <img src={instaLogo} alt="Instagram" width="100" />
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label htmlFor="instagramAccountId">Instagram Account ID</Label>
              <Input
                className="form-control"
                type="text"
                name="instagramAccountId"
                id="instagramAccountId"
                value={formValues.instagramAccountId}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="accessToken">Access Token</Label>
              <Input
                className="form-control"
                type="text"
                name="accessToken"
                id="accessToken"
                value={formValues.accessToken}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Button color="primary" type="submit">
                Configure
              </Button>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <div>
            <h3>Instructions:</h3>
            <p>To integrate Instagram, follow these steps:</p>
            <ol>
              <li>Log in to your Instagram Business or Creator account.</li>
              <li>Go to Facebook Business Settings and connect your Instagram account.</li>
              <li>Generate an Access Token from the Facebook Developer portal.</li>
              <li>
                Copy the Instagram Account ID and Access Token and paste them in the fields above.
              </li>
              <li>Click Configure, and your Instagram feed should now be integrated!</li>
            </ol>
          </div>
        </Row>
      </ModalBody>
    </Form>
  );
};

export default InstagramModal;
