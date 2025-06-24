import "react-table-v6/react-table.css";
import ComponentCardTable from "../../components/ComponentCardTable/ComponentCardTable";
import CommonTable from "../../components/Table/CommonTable/CommonTable";
import OutletCard from "../../components/OutletCard/OutletCard";
import "./Subscription.scss";
import { useCustomer } from "./_hooks/useCustomer";
import SubscriptionFormWrapper from "./Wrapper";

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
    initiatePaymentSchedule
  } = useCustomer();

  return (
    <OutletCard>

      <SubscriptionFormWrapper state={state} initiatePaymentSchedule={initiatePaymentSchedule} />

      <ComponentCardTable title={"Subscription History"} searchPlaceHolder={"Search by Name..."}>
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
    </OutletCard>
  );
};

export default Subscription;
