import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "reactstrap";
import Header from "./header/Header";
import Sidebar from "./sidebars/vertical/Sidebar";
import HorizontalHeader from "./header/HorizontalHeader";
import HorizontalSidebar from "./sidebars/horizontal/HorizontalSidebar";
import Toaster from "../components/Toaster/Toaster";
import Spinner from "../components/Spinner/Spinner";
import { getStoreInfo } from "../utils/_hooks";
import _ from "lodash";
import { ToggleMobileSidebar } from "../store/customizer/CustomizerSlice";

const FullLayout = () => {
  const dispatch = useDispatch();
  const customizerToggle = useSelector((state) => state.customizer.customizerSidebar);
  const toggleMiniSidebar = useSelector((state) => state.customizer.isMiniSidebar);
  const showMobileSidebar = useSelector((state) => state.customizer.isMobileSidebar);
  const topbarFixed = useSelector((state) => state.customizer.isTopbarFixed);
  const LayoutHorizontal = useSelector((state) => state.customizer.isLayoutHorizontal);

  const shopInformation = getStoreInfo();

  const pluginConfig = shopInformation?.store?.pluginConfig || {};
  const {
    propertyId = null,
    widgetId = null,
    isActive: isTawkActive = false
  } = pluginConfig.tawk || {};

  const {
    phoneNumber = null,
    isActive: isWhatsAppActive = false,
    userName = ""
  } = pluginConfig.whatsApp || {};

  const isNotAdmin = !_.isEmpty(shopInformation?.store);

  return (
    <main>
      <div
        className={`pageWrapper d-md-block d-lg-flex ${toggleMiniSidebar ? "isMiniSidebar" : ""}`}
        onClick={() =>
          window.innerWidth <= 768 && showMobileSidebar ? dispatch(ToggleMobileSidebar()) : ""
        }>
        {/******** Sidebar **********/}
        {LayoutHorizontal ? (
          ""
        ) : (
          <aside className={`sidebarArea ${showMobileSidebar ? "showSidebar" : ""}`}>
            <Sidebar showMobileSidebar={showMobileSidebar} />
          </aside>
        )}
        {/********Content Area**********/}

        <div className={`contentArea ${topbarFixed ? "fixedTopbar" : ""}`}>
          {/********header**********/}
          {LayoutHorizontal ? <HorizontalHeader /> : <Header />}
          {LayoutHorizontal ? <HorizontalSidebar /> : ""}

          <Container fluid className="p-0">
            <div>
              <Outlet />
              <Toaster />
              <Spinner />
            </div>
            {/* <Customizer className={customizerToggle ? "showCustomizer" : ""} /> */}
            {showMobileSidebar || customizerToggle ? <div className="sidebarOverlay" /> : ""}
          </Container>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
