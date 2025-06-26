import React, { useState } from "react";
import "./PricingCards.scss";
import { plans } from "./Subscription.constants";

const PricingCards = ({ onButtonClick }) => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  return (
    <div className="pricing-section container py-5">
      <div className="text-center mb-4">
        <div className="billing-toggle">
          <span className={billingCycle === "monthly" ? "fw-bold" : ""}>Monthly</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={billingCycle === "annually"}
              onChange={(e) => setBillingCycle(e.target.checked ? "annually" : "monthly")}
            />
            <span className="slider" />
          </label>
          <span className={billingCycle === "annually" ? "fw-bold" : ""}>Annually</span>
        </div>
      </div>

      <div className="row justify-content-center">
        {plans.map((plan) => (
          <div
            key={plan.title}
            className={`col-12 col-md-6 col-lg-4 mb-4 ${plan.isRecommended ? "recommended" : ""}`}>
            <div className="card h-100 pricing-card">
              {plan.isRecommended && <div className="badge-top">RECOMMENDED</div>}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-center">{plan.title}</h5>
                <p className="text-muted text-center mb-3">{plan.description}</p>
                <h6 className="text-center pricing">{plan.price[billingCycle]}</h6>
                {/* <p className="text-center text-muted small">{`per store/${billingCycle === "monthly" ? "month" : "annual"}`}</p> */}
                <p className="text-center text-muted small">{`per store/month`}</p>
                <button
                  className="btn btn-primary w-100 mb-2"
                  onClick={() => onButtonClick(plan, billingCycle)}>
                  {plan.buttonText}
                </button>
                <ul className="list-unstyled">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="feature-item">
                      <span className="me-2">&rarr;</span> {feature}
                    </li>
                  ))}
                </ul>
                {plan.addons?.length > 0 && (
                  <div className="mt-auto">
                    <h6 className="mt-3 fw-bold text-primary small">FEATURED ADD-ONS</h6>
                    <ul className="list-unstyled">
                      {plan.addons.map((addon, i) => (
                        <li key={i} className="text-muted small">
                          {addon}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingCards;
