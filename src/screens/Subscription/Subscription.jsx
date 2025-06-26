import "react-table-v6/react-table.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import ComponentCardTable from "../../components/ComponentCardTable/ComponentCardTable";
import CommonTable from "../../components/Table/CommonTable/CommonTable";
import OutletCard from "../../components/OutletCard/OutletCard";
import "./Subscription.scss";
import { useSubscription } from "./_hooks/useSubscription";
import SubscriptionFormWrapper from "./Wrapper";
import PricingCards from "./PricingCards";

const Subscription = () => {
  const {
    categories,
    handleCategorySelect,
    columns,
    state,
    payload,
    onApplySortFilter,
    onClearFilterChange,
    handleSearch,
    handlePerPageRowsChange,
    handlePageChange,
    currentPage,
    totalItems,
    rowsPerPage,
    handleButtonClick,
    initiatePaymentSchedule,
    formModal,
    toggle
  } = useSubscription();

  return (
    <>
      {!state.loaderStatus && (
        <OutletCard>
          <Modal isOpen={formModal} toggle={toggle} centered size="lg">
            <ModalHeader toggle={toggle}>Subscribe to Plan</ModalHeader>
            <ModalBody>
              <SubscriptionFormWrapper
                state={state}
                initiatePaymentSchedule={initiatePaymentSchedule}
              />
            </ModalBody>
          </Modal>

          {state.orderList?.length ? (
            <ComponentCardTable
              title={"Subscription History"}
              searchPlaceHolder={"Search by Name..."}>
              <CommonTable
                columns={columns}
                data={state.orderList}
                isLoading={state.loaderStatus}
                sortCallback={onApplySortFilter}
                filterCallback={onClearFilterChange}
                sort={payload.sort}
                searchOnChange={handleSearch}
                onRowsPerPageChange={handlePerPageRowsChange}
                onPageChange={handlePageChange}
                currentPage={currentPage}
                totalItems={totalItems}
                rowsPerPage={rowsPerPage}
              />
            </ComponentCardTable>
          ) : (
            <PricingCards onButtonClick={handleButtonClick} />
          )}
        </OutletCard>
      )}
    </>
  );
};

export default Subscription;
