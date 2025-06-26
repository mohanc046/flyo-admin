import { useEffect, useState } from "react";

import CIcon from "@coreui/icons-react";

import { config } from "../../config";

import "./statistics.css";
import "./statistics-title.css";

import { cilMenu } from "@coreui/icons";

import { useNavigate } from "react-router-dom";

import _ from "lodash";

import { faArrowRightLong, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { isMobileView } from "../../utils/utils";

import { Col, Form, Input, Menu, Row, Segmented } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { getAuthToken } from "../../utils/_hooks";

const currentYear = new Date().getFullYear();

const Statistics = (props) => {
  const { TextArea } = Input;

  const navigate = useNavigate();

  useEffect(() => {
    if (getAuthToken()) {
      navigate("/home");
    }
  }, [localStorage]);

  const isMobileLayout = isMobileView();
  const [openMenu, setOpenMenu] = useState(false);
  const [play, setPlay] = useState(false);

  const renderBanner = () => {
    const handleVideoClick = () => {
      setPlay(true);
      const video = document.getElementById("background-video");
      video.play();
    };

    return (
      <div className="banner-container">
        <div className="header d-flex justify-content-between align-items-center">
          <div className="img-container logo" onClick={() => navigate("/home")}>
            <img src={config.LOGO_BLUE} alt="" />
          </div>
          <div className="btn-grp">
            <button className="btn btn-no-bg" onClick={() => navigate("/pricing-list")}>
              Solutions
            </button>
            <button className="btn btn-no-bg" onClick={() => navigate("/pricing-list")}>
              Pricing
            </button>
            <button className="btn btn-no-bg" onClick={() => navigate("/login")}>
              Login
            </button>
            {/* <button className="btn btn-primary primary-color" onClick={() => navigate('/login')}>Get Started</button> */}
          </div>
          <div className="mobile-hamburger d-flex justify-content-end w-100 pe-4 pt-4">
            <MenuOutlined onClick={() => setOpenMenu(true)} style={{ fontSize: 22 }} />
          </div>
          {openMenu && (
            <div
              className="position-fixed top-0 end-0 bottom-0 start-0 z-2 bg-body"
              onClick={() => setOpenMenu(false)}>
              <Menu
                className="pt-5 ps-4"
                items={[
                  {
                    label: (
                      <button
                        className="btn btn-white-bg"
                        onClick={() => navigate("/pricing-list")}>
                        Solutions
                      </button>
                    )
                  },
                  {
                    label: (
                      <button
                        className="btn btn-white-bg"
                        onClick={() => navigate("/pricing-list")}>
                        Pricing
                      </button>
                    )
                  },
                  {
                    label: (
                      <button
                        className="btn btn-primary-color-bg"
                        onClick={() => navigate("/login")}>
                        Login
                      </button>
                    )
                  }
                ]}
              />
            </div>
          )}
        </div>
        <Row>
          <Col lg={{ span: 12 }} span={24} className="content">
            <h4 className="title title-black">
              Your global online shop, Its <span className="color-majorelle-blue">here</span>
            </h4>
            <p className="description">
              Get your awesome global online video shop in 30 seconds and manage customers,
              payments, shipping, social, marketplace, analytics via one app.
            </p>
          </Col>
          <Col lg={{ span: 12 }} span={24}>
            <img className="w-100" src={config.BANNER_STATS} alt="" />
          </Col>
        </Row>
        <div className="get-started d-flex align-items-center">
          <button className="btn btn-primary primary-color" onClick={() => navigate("/login")}>
            Get Started
          </button>
        </div>
      </div>
    );
  };

  const renderStatsContainer = () => {
    return (
      <Row className="stats-container-content mt-5">
        <img className="background" src={config.BACKGROUND_GLOBE} alt="" />
        <p className="title title-black">Flyashop powers businesses of all</p>
        <p className="title title-black">shapes and sizes build and scale globally — </p>
        <p className="title title-black">
          from <span className="color-majorelle-blue">hey people</span> to a billion dollar{" "}
          <span className="color-majorelle-blue">unicorn</span>.
        </p>
        <Row className="items w-100">
          <Col span={12} className="tag-lines-card">
            <h4 className="count">Millions</h4>
            <span className="tag-line">of merchants worldwide</span>
          </Col>
          <Col span={12} className="tag-lines-card">
            <h4 className="count">10%</h4>
            <span className="tag-line">of total US ecommerce</span>
          </Col>
          <Col span={12} className="tag-lines-card">
            <h4 className="count">170+ </h4>
            <span className="tag-line">countries represented</span>
          </Col>
          <Col span={12} className="tag-lines-card">
            <h4 className="count">$444B</h4>
            <span className="tag-line "> global economic activity</span>
          </Col>
        </Row>
      </Row>
    );
  };

  const renderWays = () => {
    return (
      <div className="ways-container">
        <h4 className="title title-black">Shopping simplified via videos in 3 easy steps</h4>
        <h4 className="desc">
          Let your customers experience the power of videos to shop for your products and services.
        </h4>
        <Segmented
          defaultValue="center"
          style={{ marginBottom: 8 }}
          // onChange={(value) => setAlignValue(value as Align)}
          options={["1", "2", "3"]}
          className="ways-segmentation mt-5"
          value={"1"}
        />
        <div className="steps d-flex align-items-center">
          <div className="steps-description">
            <h4 className="label">1 Name your video shop</h4>
            <li>
              <p className="step">
                The nights you’ve lost, the fights you’ve fought... to find the perfect name.
              </p>
            </li>
            <li>
              <p className="step">Now is the time to make it happen.</p>
            </li>
            <li>
              <p className="step">Name your shop, choose a category and say a prayer.</p>
            </li>
            <li>
              <p className="step">Let the world know what you have to offer.</p>
            </li>
            <li>
              <p className="step">Name your shop, choose a category and pay simply.</p>
            </li>
          </div>
          <div className="steps-banner">
            <div className="bg"></div>
            <div className="content">
              <input type="text" className="text-field" placeholder="Enter business name" />
              <input type="text" className="text-field" placeholder="Choose business category" />
              <button className="btn btn-primary primary-color">Create my shop</button>
            </div>
          </div>
        </div>

        <div className="steps d-flex align-items-center">
          <div className="steps-description">
            <h4 className="label">2 Upload product video</h4>
            <li>
              <p className="step">
                The nights you’ve lost, the fights you’ve fought... to find the perfect name.
              </p>
            </li>
            <li>
              <p className="step">Now is the time to make it happen.</p>
            </li>
            <li>
              <p className="step">Name your shop, choose a category and say a prayer.</p>
            </li>
            <li>
              <p className="step">Let the world know what you have to offer.</p>
            </li>
            <li>
              <p className="step">Name your shop, choose a category and pay simply.</p>
            </li>
          </div>
          <div className="steps-banner">
            {/* <div className="bg"></div> */}
            <div className="content">
              <div className="step-card">
                <img src={config.RED_VELVET_IMAGE} alt="" />
                <div className="details d-flex flex-column justify-content-center">
                  <span className="name">Red Velvet Cake</span>
                  <span>
                    <span className="price">$ 4</span>{" "}
                    <span className="price stricked-out">$ 8</span>{" "}
                  </span>
                </div>
              </div>
              <div className="step-card">
                <img src={config.CHOCO_CHIP_IMAGE} alt="" />
                <div className="details d-flex flex-column justify-content-center">
                  <span className="name">Choco-chip butter cookies</span>
                  <span>
                    <span className="price">$ 3</span>{" "}
                    <span className="price stricked-out">$ 5</span>{" "}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="steps d-flex align-items-center">
          <div className="steps-description">
            <h4 className="label">3 Start selling</h4>
            <li>
              <p className="step">
                The nights you’ve lost, the fights you’ve fought... to find the perfect name.
              </p>
            </li>
            <li>
              <p className="step">Now is the time to make it happen.</p>
            </li>
            <li>
              <p className="step">Name your shop, choose a category and say a prayer.</p>
            </li>
            <li>
              <p className="step">Let the world know what you have to offer.</p>
            </li>
            <li>
              <p className="step">Name your shop, choose a category and pay simply.</p>
            </li>
          </div>
          <div className="steps-banner">
            <div className="bg"></div>
            <div className="content selling">
              <div className="top d-flex align-items-center">
                <img src={config.DELIFRESH_LOGO} alt="" className="logo" />
                <div className="details d-flex flex-column">
                  <span className="title title-black"> Delifresh Bakery</span>
                  <span className="label"> Trusted Seller</span>
                </div>
                <CIcon height={38} style={{ cursor: "pointer" }} icon={cilMenu} size="lg" />
              </div>
              <input type="text" className="search-product" placeholder="Search products" />
              <span className="deals-title title-black">Todays deals</span>
              <div className="deals d-flex justify-content-between">
                <img src={config.COOKIES_IMAGE} alt="" />
                <img src={config.PASTRIES_IMAGE} alt="" />
                <img src={config.DONUTS_IMAGE} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderBuildSimply = () => {
    return (
      <div className="build-simply d-flex flex-column align-items-center">
        <img src={config.BUILD_SIMPLE_GROUP} alt="" className="banner" />
      </div>
    );
  };

  const renderNextLevelEcommerce = () => {
    return (
      <div className="next-level d-flex flex-column align-items-center">
        <img className="background" src={config.BACKGROUND_ECOMMERCE} alt="" />
        <h4 className="title title-black">Next level eCommerce</h4>
        <p className="description">
          With our cutting-edge technology, your business is now more agile, more intelligent and
          far more scalable than ever before
        </p>
        <div className="next-level-grid">
          <div className="next-level-grid-item d-flex flex-column align-items-center">
            <div className="img-container d-flex align-items-center justify-content-center">
              <img src={config.DIGITAL_SHOP_ICON} alt="" />
            </div>
            <h4 className="title title-black">Digital Shop</h4>
            <p className="description">Amazing online shop experience from easy templates</p>
          </div>
          <div className="next-level-grid-item d-flex flex-column align-items-center">
            <div className="img-container d-flex align-items-center justify-content-center">
              <img src={config.GLOBAL_ICON} alt="" />
            </div>
            <h4 className="title title-black">Global Audience</h4>
            <p className="description">
              Create your own online store within seconds. Share it via social media.
            </p>
          </div>
          <div className="next-level-grid-item d-flex flex-column align-items-center">
            <div className="img-container d-flex align-items-center justify-content-center">
              <img src={config.UNLIMITED_PRODUCTS_ICON} alt="" />
            </div>
            <h4 className="title title-black">Unlimited Products</h4>
            <p className="description">
              Create your own online store within seconds. Share it via social media.
            </p>
          </div>
          <div className="next-level-grid-item d-flex flex-column align-items-center">
            <div className="img-container d-flex align-items-center justify-content-center">
              <img src={config.DATA_ANALYTICS_ICON} alt="" />
            </div>
            <h4 className="title title-black">Data Analytics</h4>
            <p className="description">
              Create your own online store within seconds. Share it via social media.
            </p>
          </div>
          <div className="next-level-grid-item d-flex flex-column align-items-center">
            <div className="img-container d-flex align-items-center justify-content-center">
              <img src={config.TRACK_INVENTORY_ICON} alt="" />
            </div>
            <h4 className="title title-black">Track Inventory</h4>
            <p className="description">
              Create your own online store within seconds. Share it via social media.
            </p>
          </div>
          <div className="next-level-grid-item d-flex flex-column align-items-center">
            <div className="img-container d-flex align-items-center justify-content-center">
              <img src={config.CUSTOMER_CREDIT_ICON} alt="" />
            </div>
            <h4 className="title title-black">Customer Credit</h4>
            <p className="description">
              Create your own online store within seconds. Share it via social media.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const growOnlineShoppingCardView = () => {
    const data = [
      {
        imagePath: config.IMPROVE_SHOPPING_IMAGE_1,
        description: "A Beginner’s Guide to Dropshipping"
      },
      {
        imagePath: config.IMPROVE_SHOPPING_IMAGE_2,
        description: "10 Best eCommerce Platforms"
      },
      {
        imagePath: config.IMPROVE_SHOPPING_IMAGE_3,
        description: "How to Start a Food Business Online"
      }
    ];

    return (
      <div className="grow-shopping-container">
        <div className="grow-shopping-container-header-label">
          Grow your online shop. Learn how to sell online from experts
        </div>
        <div className="growShopParentContainer">
          {_.map(data, (item, index) => (
            <div className="growIndividualShopContainer">
              <img className="growShopImageContainer" src={item.imagePath} />
              <div className={`actions ${index == 1 ? "" : "invisible"}`}>
                <FontAwesomeIcon className="left" icon={faArrowLeft} />
                <FontAwesomeIcon className="right" icon={faArrowRightLong} />
              </div>
              <label className="growShopLabelContainer">{item.description}</label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const customizationCardView = () => {
    return (
      <div className="customizeShopPlatformContainer">
        <label className="customizePlatformLabelContainer">
          The most customizable eCommerce platform for building your online business.
        </label>
        <div className="customizePlatformButtonParentContainer">
          <button
            className="customizePlatformButtonContainerButton"
            onClick={() => navigate("/login")}>
            <label className="customizeButtonLabelContainer">Get Started</label>
          </button>
        </div>
      </div>
    );
  };

  const renderGetInTouch = () => {
    return (
      <Row className="get-in-touch ">
        <p className="title title-black">Get in touch</p>
        <Row>
          <Col lg={13} span={24}>
            <Form className="get-in-touch-form">
              <Row>
                <Col span={12} className="px-3">
                  <Form.Item
                    name="name"
                    rules={[{ required: true, message: "Please input your name!" }]}>
                    <Input placeholder="Name" />
                  </Form.Item>
                </Col>
                <Col span={12} className="px-3">
                  <Form.Item
                    name="email"
                    rules={[{ required: true, message: "Please input your email!" }]}>
                    <Input placeholder="Email" />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12} className="px-3">
                  <Form.Item
                    name="contact"
                    rules={[{ required: true, message: "Please input your name!" }]}>
                    <Input placeholder="Contact" />
                  </Form.Item>
                </Col>
                <Col span={12} className="px-3">
                  <Form.Item
                    name="subject"
                    rules={[{ required: true, message: "Please input your email!" }]}>
                    <Input placeholder="Subject" />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24} className="px-3">
                  <Form.Item
                    name="messge"
                    rules={[{ required: true, message: "Please input your name!" }]}>
                    <TextArea placeholder="Message" rows={8} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <button className="btn btn-primary primary-color">Send</button>
              </Row>
            </Form>
          </Col>
          <Col lg={11} span={24} className="right d-flex justify-content-center px-5 flex-column">
            <p className="label">Hi ! Drop Us A Message Or Email Us </p>
            <p className="mail">hi@flyashop.com</p>
            <Row>
              <img src={config.INSTAGRAM_LOGO} className="me-3" alt="" />
              <img src={config.WHATSAPP_LOGO} className="me-3" alt="" />
              <img src={config.FACEBOOK_LOGO} className="me-3" alt="" />
            </Row>
          </Col>
        </Row>
      </Row>
    );
  };

  const renderSellEveryWhere = () => {
    return (
      <div className="d-flex sell-everywhere">
        <div>
          <img src={config.SELL_EVERYWHERE_BANNER} alt="" />
        </div>
        <div className="sell-everywhere-right">
          <img src={config.SELL_EVERYWHERE_BANNER_2} alt="" />
        </div>
      </div>
    );
  };

  const renderMultipleChannelContents = () => {
    return (
      <Row className="multiple-channels-content">
        <p className="title title-black">Where run your shop via</p>
        <p className="title title-black">multiple channels</p>
        <p className="description">
          With our cutting-edge technology, your business is now more agile, more intelligent and
          far more scalable than ever before
        </p>
        <Row className="multiple-channel-items">
          <Col className="multiple-channel-item" lg={8} span={24}>
            <div className="content">
              <p className="title title-black">Online Shop</p>
              <p className="description">
                {" "}
                With our cutting-edge technology, your business is now more agile, more intelligent
                and far more scalable than ever before
              </p>
              <p className="know-more">Know More</p>
            </div>
            <img src={config.MULTIPLE_CHANNEL_1} alt="" />
          </Col>
          <Col className="multiple-channel-item" lg={8} span={24}>
            <div className="content">
              <p className="title title-black">Online Shop</p>
              <p className="description">
                {" "}
                With our cutting-edge technology, your business is now more agile, more intelligent
                and far more scalable than ever before
              </p>
              <p className="know-more">Know More</p>
            </div>
            <img src={config.MULTIPLE_CHANNEL_2} alt="" />
          </Col>
          <Col className="multiple-channel-item" lg={8} span={24}>
            <div className="content">
              <p className="title title-black">Online Shop</p>
              <p className="description">
                {" "}
                With our cutting-edge technology, your business is now more agile, more intelligent
                and far more scalable than ever before
              </p>
              <p className="know-more">Know More</p>
            </div>
            <img src={config.MULTIPLE_CHANNEL_3} alt="" />
          </Col>
        </Row>
      </Row>
    );
  };

  const renderEnhanceSite = () => {
    return (
      <Row className="enhance-site">
        <p className="title title-black"> Enhance your site's functionality with plugins</p>
        <p className="description">
          {" "}
          Choose from over 40+ plugins. Be it tracking analytics, managing shipments to building
          email lists. There's a plugin for everything.
        </p>
        <img src={config.ENHANCE_SITE_LOGOS} alt="" />
        <button
          className="btn btn-primary primary-color get-started"
          onClick={() => navigate("/login")}>
          Get Started
        </button>
      </Row>
    );
  };

  const renderTrustedBy = () => {
    return (
      <div className="trusted-by">
        <h4 className="title title-black">Trusted by 1000s of shop owners</h4>
        <h4 className="title title-black">across the world</h4>
        <div className="content">
          <div className="content-card-bg"></div>
          <div
            className="actions mt-5 justify-content-end"
            style={{ paddingRight: "80px", marginBottom: 30 }}>
            <FontAwesomeIcon className="left" icon={faArrowLeft} />
            <FontAwesomeIcon className="right" icon={faArrowRightLong} />
          </div>
          <div className="content-card">
            <img src={config.DOUBLE_QUOTES} alt="" />
            <span className="description">
              No other eCommerce platform allows people to start for free and grow their store as
              their business grows. More importantly, Shopstaar doesn't charge you a portion of your
              profits as your business grows!
            </span>
          </div>
          <div className="actions mt-5">
            <div className="circle-small"></div>
            <div className="circle-big"></div>
            {/* <FontAwesomeIcon className="left" icon={faArrowLeft} />
                        <FontAwesomeIcon className="right" icon={faArrowRightLong} /> */}
          </div>
        </div>
      </div>
    );
  };

  const brands = [
    config.TECH_IN_ASIA_LOGO,
    config.FORBES_LOGO,
    config.TECH_CRUNCH_LOGO,
    config.FINANCIAL_TIMES_LOGO,
    config.BLOOMBERG_LOGO
  ];
  const renderBrands = () => {
    return (
      <div className="brands">
        {brands.map((brand) => (
          <div className="brand-card">
            <img src={brand} alt="" className="brand-log" />
          </div>
        ))}
      </div>
    );
  };
  const renderFooter = () => {
    return (
      <Row className="footer-container">
        <img className="footer-logo" src={config.LOGO_BLUE} alt="" />
        <Col lg={14} span={24} className="left d-flex align-items-end">
          <p className="">
            Get your awesome, seamless online shop in seconds and manage customers, payments,
            credit, shipping, social, marketplace via one app
          </p>
        </Col>
        <Col lg={10} span={24} className="right">
          <Row>
            <Col span={12}>
              <p>Company</p>
              <p>About</p>
              <p>Help Desk</p>
              <p>Market Share Reports</p>
            </Col>
            <Col span={12}>
              <p>Support</p>
              <p>Documentation</p>
              <p>Support Policy</p>
              <p>FAQs</p>
            </Col>
          </Row>
          <Row>
            <p className="copyrights">Copyright © {currentYear} Flyashop. All Rights Reserved. </p>
          </Row>
        </Col>
      </Row>
    );
  };
  return (
    <div className="statistics-container">
      {renderBanner()}
      {renderStatsContainer()}
      {renderWays()}
      {renderNextLevelEcommerce()}
      {renderSellEveryWhere()}
      {renderMultipleChannelContents()}
      {renderBuildSimply()}
      {renderEnhanceSite()}
      {renderTrustedBy()}
      {growOnlineShoppingCardView()}
      {renderBrands()}
      {customizationCardView()}
      {renderGetInTouch()}
      {renderFooter()}
    </div>
  );
};

export default Statistics;
