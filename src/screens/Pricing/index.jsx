import React, { Fragment } from 'react';

import "../ProductList/style.css"

import { AppHeader, AppSidebar } from '../../components/index'

import { useNavigate } from "react-router-dom";

import { isMobileView } from '../../utils';

import { PricingCard } from './List';

import CustomHeader from '../../components/CustomHeader';

import CustomFooter from '../../components/CustomFooter';
import { CAccordion, CAccordionBody, CAccordionHeader, CAccordionItem, CFormSelect, CImage, CTable, CTableBody, CTableDataCell, CTableHeaderCell, CTableRow } from '@coreui/react';
import _ from 'lodash';
import { config } from '../../config';

export default function Pricing() {

    const navigate = useNavigate();

    const navigateToOrderDetails = () => {
        return navigate('/order')
    }

    const DropDownComponent = () => {
        return (
            <div className="drop-down">
                <CFormSelect options={[{ label: "United Kingdom", value: "UK" }]} />
            </div>
        )
    }


    const includedInAllPlans = [
        {
            title: "Ecommerce",
            contents: ["Free Sub Domain", "Free Custom Domain on select plans", "60+ Free design templates", "Modular design templates", "CSS customization", "Unlimited product listings", "Multiple image uploads", "Product options listings", "Secure website", "Mobile friendly store", "SEO friendly webstore", "Single Checkout Link"],
        },
        {
            title: "Payment Gateway",
            contents: ["Free integration of Payment Gateway", "Instant payment acceptance", "International & domestic payments", "Multiple payment solutions", "Preferential rates", "No hidden commissions"]
        },
        {
            title: "Shipping & Logistics",
            contents: ["Free integration of Shipping & Logistics", "Ship directly from online store", "International & domestic coverage", "Multiple shipping solutions", "Preferential rates", "Automated shipping management",]
        },
        {
            title: "Multiple Sales Channels",
            contents: ["List on Facebook store", "Single click listing", "Automated inventory management", "Social media share",]
        },
        {
            title: "Sales Management",
            contents: ["Sales expansion tools", "Discount engine & promotions", "Comprehensive dashboard", "Intelligent data insights", "Enable Google Analytics",]
        },
        {
            title: "Customer Support",
            contents: ["Free email support", "Free live chat support", "Knowledge base",]
        }
    ]

    const FAQs = [
        {
            question: "How does the custom domain work?",
            answer: "When you upgrade to Shopstaar Premium, you can choose a custom domain of your choice for FREE. This domain will be linked to your Shopstaar store and customers can visit this domain to check your store and place orders. In case you want to change the domain name in the future, you can pay additional charges for the domain and link it to your store. To learn how to buy a custom domain, watch this video."
        },
        {
            question: "Can I link any existing domain to Shopstaar  store?",
            answer: "Can I link any existing domain to Shopstaar  store?",
        },
        {
            question: "What all plugins can I use?",
            answer: "What all plugins can I use?",
        },
        {
            question: "What are Shopstaar Credits?",
            answer: "What are Shopstaar Credits?",
        },
        {
            question: "Can I integrate another payment gateway to accept online payments?",
            answer: "Can I integrate another payment gateway to accept online payments?",
        },
        {
            question: "Will there be an auto-debit after the Premium subscription ends?",
            answer: "Will there be an auto-debit after the Premium subscription ends?",
        },
        {
            question: "What payment methods do you offer?",
            answer: "What payment methods do you offer?",
        },
        {
            question: "What type of businesses can use Shopstaar Premium?",
            answer: "What type of businesses can use Shopstaar Premium?",
        },
    ]

    const renderPriceList = () => {
        return (
            <CTable className='price-table'>
                <CTableBody>
                    <CTableRow>
                        <CTableHeaderCell><div className='no-border'></div></CTableHeaderCell>
                        <CTableHeaderCell><div style={{ borderTopLeftRadius: 10 }}>Transaction Type</div></CTableHeaderCell>
                        <CTableHeaderCell colSpan={2} className='double-width'><div style={{ borderTopRightRadius: 10 }} >Subscription Type</div></CTableHeaderCell>
                    </CTableRow>
                    <CTableRow>
                        <CTableDataCell><div style={{ borderTopLeftRadius: 10 }} className='row-title'>Pricing</div></CTableDataCell>
                        <CTableDataCell>
                            <div className='d-flex flex-column align-items-cente price-card'>
                                <span className="label">Free</span>
                                <span className="label-sub">For getting started</span>
                                <span className="price"><span className='currency'><sup>$</sup></span>  0</span>
                                <span className="label-light">Per Month</span>
                            </div>
                        </CTableDataCell>
                        <CTableDataCell>
                            <div className='d-flex flex-column align-items-cente price-card'>
                                <span className="label">3 Months Plan</span>
                                <span className="price"><span className='currency'><sup>$</sup></span>  19</span>
                                <span className="label-light">Per Month</span>
                            </div>
                        </CTableDataCell>
                        <CTableDataCell>
                            <div className='d-flex flex-column align-items-cente price-card'>
                                <span className="label">12 Months Plan</span>
                                <span className="price"><span className='currency'><sup>$</sup></span>  49</span>
                                <span className="label-light">Per Month</span>
                                <span className="discount">Save 33%</span>
                            </div>
                        </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                        <CTableDataCell><div className='row-title'>Transaction Fee</div></CTableDataCell>
                        <CTableDataCell><div> <span className='label'>3.99 % of sale</span></div></CTableDataCell>
                        <CTableDataCell><div > <span className='label'>1.99 %</span></div></CTableDataCell>
                        <CTableDataCell><div ><span className='label'>0.99 %</span></div></CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                        <CTableDataCell><div className='row-title'>Monthly Hosting Fee</div></CTableDataCell>
                        <CTableDataCell><div> <span className='label'>No Hosting Fee</span></div></CTableDataCell>
                        <CTableDataCell><div > <span className='label'>Free</span></div></CTableDataCell>
                        <CTableDataCell><div ><span className='label'>Free</span></div></CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                        <CTableDataCell><div className='row-title'>Free Custom Domain</div></CTableDataCell>
                        <CTableDataCell><div> <span className='label'>-</span></div></CTableDataCell>
                        <CTableDataCell><div > <span className='label'>Yes</span></div></CTableDataCell>
                        <CTableDataCell><div ><span className='label'>Yes</span></div></CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                        <CTableDataCell><div style={{ borderBottomLeftRadius: 10 }}></div></CTableDataCell>
                        <CTableDataCell><div className='d-flex justify-content-center'><button className='btn btn-primary primary-color button ' onClick={() => navigate('/login')}>Get Started</button></div></CTableDataCell>
                        <CTableDataCell><div className='d-flex justify-content-center' > <button className='btn btn-primary primary-color button ' onClick={() => navigate('/login')}>Get Started</button></div></CTableDataCell>
                        <CTableDataCell><div style={{ borderBottomRightRadius: 10 }} className='d-flex justify-content-center' ><button className='btn btn-primary primary-color button ' onClick={() => navigate('/login')}>Get Started</button></div></CTableDataCell>
                    </CTableRow>
                </CTableBody>
            </CTable>
        )
    }

    const renderIncludedIn = () => {
        return (
            <div className="included-in-all d-flex flex-column align-items-center">
                <h4 className="title">Included in all plans</h4>
                <div className="included-in-all-list">
                    {
                        _.chunk(includedInAllPlans, 3).map(chunk => (
                            <div className='included-in-all-list-row'>{
                                _.map(chunk, each => (
                                    <div className="included-in-all-card">
                                        <div className="heading">{each.title}</div>
                                        <div className="content d-flex flex-column">
                                            {
                                                each.contents.map(item => <span>{item}</span>)
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }

    const renderFaq = () => {
        return (
            <div className="faq-container">
                <h4 className="title">Frequently asked questions</h4>
                <CAccordion className='faq-list' activeItemKey={0}>
                    {
                        FAQs.map((question, index) => (
                            <CAccordionItem itemKey={index}>
                                <CAccordionHeader>{question.question}</CAccordionHeader>
                                <CAccordionBody>
                                    {question.answer}
                                </CAccordionBody>
                            </CAccordionItem>
                        )
                        )
                    }
                </CAccordion>
            </div>
        )
    }

    const renderCopyRights = () => {
        return (
            <div className="copyrights-container d-flex align-items-center justify-content-between">
                <CImage src={config.LOGO_BLUE} />
                <span className='copyrights'>Copyright© 2023 Flyashop. All Rights Reserved. </span>
            </div>
        )
    }
    const renderWebUI = () => {
        return (
            <div className='whiteBgColor pricing-container'>
                <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                    <AppHeader
                        heading={"Pricing"}
                        RightComponent={() => <DropDownComponent />}
                        showBrand={false}
                        showAvatar={false}
                        showLogo={true}
                    />
                    <div className={`body flex-grow-1 px-3 DefaultMarginBottom whiteBgColor container`}>
                        <div className="select-plan-container d-flex flex-column align-items-center">
                            <h4 className="title">Select a plan</h4>
                            <p className="description">
                                Your current Free Plan will be expire soon. You can select a better plan for shop experience. You can change your plan at any time.
                            </p>
                            {renderPriceList()}
                            {renderIncludedIn()}
                            {renderFaq()}
                            {renderCopyRights()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderPricingCardUI = () => {
        return <Fragment>
            <div className="mobileOrderLayout">
                <div className='pricingSubSectionMobileLayout'>
                    <PricingCard />
                </div>
            </div>
        </Fragment>
    }

    const renderMobileUI = () => {
        return <div>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                <CustomHeader heading={"Pricing"} />

                <div className='pricingHeaderContainer '>
                    <div className='pricingHeaderTitleContainer'>
                        Explore our pricing plans below and choose the one that best suits your needs and budget, so you can start enjoying the benefits of our service.
                    </div>
                </div>

                <div className={`body flex-grow-1`}>
                    {renderPricingCardUI()}
                </div>
                <CustomFooter />
            </div>
        </div>
    }

    return <>
        {
            isMobileView() ? renderMobileUI() : renderWebUI()
        }
    </>
}