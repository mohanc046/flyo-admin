import React from "react";
import "react-table-v6/react-table.css";
import { Card, Col, Modal, ModalHeader, Row } from "reactstrap";
import OutletCard from "../../components/OutletCard/OutletCard";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import "./Plugins.scss";
import { usePlugins } from "./_hooks/usePlugins";
import { pluginsCategories } from "./Plugins.constants";
import PluginCard from "./components/PluginCard";
import TawkModal from "./components/TawkModal";
import GoogleAnalyticsModal from "./components/GoogleAnalyticsModal";
import WhatsAppModal from "./components/WhatsAppModal";

const Plugins = () => {
  const { handleCategorySelect, toggle, currentPlugin, modal, filteredPlugins, selectedCategory } =
    usePlugins();

  return (
    <OutletCard>
      <Card className="d-flex justify-content-between flex-column flex-wrap bg-light">
        <CategoryFilter
          categories={pluginsCategories}
          onSelect={handleCategorySelect}
          currentCategory={selectedCategory}
        />
        <Row className="d-flex flex-wrap mt-4 card-container">
          {filteredPlugins.length > 0 ? (
            filteredPlugins.map((plugin, index) => (
              <Col key={index} style={{ marginBottom: "10px" }}>
                <PluginCard details={plugin} toggle={toggle} />
              </Col>
            ))
          ) : (
            <Col xs="12">
              <p className="text-center">No plugins found for this category.</p>
            </Col>
          )}
        </Row>
      </Card>
      <Modal isOpen={modal} toggle={toggle} size="md">
        <ModalHeader toggle={toggle}>{currentPlugin.toString()}</ModalHeader>
        {currentPlugin === "Tawk.To : Live Chat" ? (
          <TawkModal />
        ) : currentPlugin === "Google Analytics" ? (
          <GoogleAnalyticsModal />
        ) : currentPlugin === "WhatsApp" ? (
          <WhatsAppModal />
        ) : null}
      </Modal>
    </OutletCard>
  );
};

export default Plugins;
