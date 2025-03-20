import React from "react";
import "react-table-v6/react-table.css";
import { Card, Modal, ModalHeader } from "reactstrap";
import * as Icon from "react-feather";
import ComponentCardTable from "../../components/ComponentCardTable/ComponentCardTable";
import CommonTable from "../../components/Table/CommonTable/CommonTable";
import OutletCard from "../../components/OutletCard/OutletCard";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import { useProductList } from "./_hooks/useProductList";
import Button from "../../components/Button/Button";
import "./ProductList.scss";
import Lottie from "lottie-react";
import successAnimation from "../../assets/lottie/success.json";

const ProductList = () => {
  const {
    handleCategorySelect,
    columns,
    handleNavigateAddproduct,
    state,
    mapProductDataToTable,
    onClearFilterChange,
    onApplySortFilter,
    payload,
    handleSearch,
    handlePerPageRowsChange,
    handlePageChange,
    currentPage,
    totalItems,
    rowsPerPage,
    handleNavigateProductDetails,
    fileInputRef,
    handleButtonClick,
    handleFileChange,
    downloadReport,
    showModal,
    setShowModal,
    categoryList,
    handleSampleFileDownload
  } = useProductList();

  return (
    <OutletCard>
      <Card className="d-flex justify-content-between p-3 flex-row flex-wrap gap-3 bg-light">
        <CategoryFilter
          categories={categoryList}
          onSelect={handleCategorySelect}
          currentCategory={payload.categoryType}
        />

        <div className="d-flex align-items-center gap-3 bg-light flex-wrap">
          <Button
            label="Sample CSV File"
            icon={<Icon.FileText size={15} />}
            onClick={() => handleSampleFileDownload()}
          />
          <Button
            label="Bulk Upload"
            icon={<Icon.File size={15} />}
            onClick={() => handleButtonClick()}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={(event) => handleFileChange(event)}
            style={{ display: "none" }}
            accept=".csv"
          />
          <Button
            label="Report"
            icon={<Icon.Download size={15} />}
            onClick={() => downloadReport()}
          />
          <Button
            label="Add New Product"
            icon={<Icon.PlusCircle size={15} />}
            onClick={handleNavigateAddproduct}
          />
        </div>
      </Card>

      <ComponentCardTable title={"Manage Products"} searchPlaceHolder={"Search Product by Name..."}>
        <CommonTable
          columns={columns}
          data={mapProductDataToTable(state?.productsList)}
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
          handleRowClick={handleNavigateProductDetails}
        />
      </ComponentCardTable>
      <Modal isOpen={showModal} toggle={() => setShowModal(!showModal)} size="md">
        <ModalHeader toggle={() => setShowModal(!showModal)}>
          Product Uploaded Successfully
        </ModalHeader>
        <div style={{ alignSelf: "center", justifyContent: "center", alignItems: "center" }}>
          <Lottie
            animationData={successAnimation}
            loop={true}
            style={{ width: 300, height: 300 }}
          />
        </div>
      </Modal>
    </OutletCard>
  );
};

export default ProductList;
