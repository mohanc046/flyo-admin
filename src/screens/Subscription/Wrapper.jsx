import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Container, Card, Button, Alert, Form, Spinner } from "react-bootstrap";
import { getStoreInfo, getUserProfile } from "../../utils/_hooks";
import _ from "lodash";

// Load Stripe
const stripePromise = loadStripe(
  "pk_test_51QhaAgETfYJwWWxsBv4cnsTFBhul2GFeoXKMEmO5VvFnuomNsdMdJzZgnZ8FX1gzcb7Ri2Z6Yj7IPwNmKx2nGfvg00GgoToekw"
);

// Card styling for Stripe
const CARD_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#212529",
      "::placeholder": {
        color: "#adb5bd"
      }
    },
    invalid: {
      color: "#dc3545"
    }
  }
};

const SubscriptionForm = ({
  isSubscriptionCreationSuccess,
  subscriptionErrorMessage,
  paymentLoaderStatus,
  initiatePaymentSchedule
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSubscriptionCreationSuccess) {
      setMessage({ type: "success", text: "✅ Payment method created successfully!" });
      setTimeout(() => window.location.reload(), 2000);
    }
    if (!_.isEmpty(subscriptionErrorMessage)) {
      setMessage({ type: "danger", text: subscriptionErrorMessage });
    }
  }, [isSubscriptionCreationSuccess, subscriptionErrorMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: "Shan Abbas",
        email: "shan@example.com"
      }
    });

    setLoading(false);

    if (error) {
      setMessage({ type: "danger", text: error.message });
      return;
    }

    // make an API to initiate the create
    const storeName = getStoreInfo()?.store?.domainName;

    if (!_.isEmpty(storeName)) {
      await initiatePaymentSchedule({
        storeName,
        firstName: getUserProfile()?.firstName || getUserProfile()?.email?.split("@")[0],
        email: getUserProfile()?.email,
        phone: "+1234561449",
        paymentMethodId: paymentMethod.id
      });
    } else {
      setMessage({ type: "danger", text: "Invalid store access!" });
      return;
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Card className="p-4 shadow-lg" style={{ width: "100%", maxWidth: "500px" }}>
        <h4 className="mb-3 text-center">Subscription Payment</h4>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 p-3 border rounded bg-light">
            <CardElement options={CARD_OPTIONS} />
          </Form.Group>

          <div className="d-grid">
            <Button type="submit" disabled={!stripe || loading}>
              {loading || paymentLoaderStatus ? (
                <Spinner size="sm" animation="border" />
              ) : (
                "Start Subscription"
              )}
            </Button>
          </div>

          {message && (
            <Alert variant={message.type} className="mt-3 text-center">
              {message.text}
            </Alert>
          )}
        </Form>
      </Card>
    </Container>
  );
};

const SubscriptionFormWrapper = ({ state, initiatePaymentSchedule }) => {
  return (
    <Elements stripe={stripePromise}>
      <SubscriptionForm {...state} initiatePaymentSchedule={initiatePaymentSchedule} />
    </Elements>
  );
};

export default SubscriptionFormWrapper;
