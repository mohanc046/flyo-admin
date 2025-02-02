import React from "react";
import OutletCard from "../../components/OutletCard/OutletCard";
import { useSettings } from "./_hooks/useSettings";
import { Card, CardTitle } from "reactstrap";
import CommonTable from "../../components/Table/CommonTable/CommonTable";

const Settings = () => {
  const { columns, data } = useSettings();

  return (
    <OutletCard>
      <Card className="bg-white shadow-sm w-100 p-4 mb-5">
        <CardTitle tag="h4" className="mb-3">
          Domains
        </CardTitle>
        <span className="text-muted fs-8 mb-3">
          Set up and personalize your store's web address.
        </span>
        <CommonTable columns={columns} data={data} hidePagination hideSearch />
      </Card>
      <Card className="bg-white shadow-sm w-100 p-4">
        <CardTitle tag="h4" className="mb-3">
          Connect external domain
        </CardTitle>
        <span className="text-muted fs-8 mb-3">
          You can connect your existing domain to Flyashop in just a few minutes{" "}
        </span>
        <Card className="d-flex justify-content-center align-items-center bg-white">
          <div className="ratio ratio-16x9 w-100" style={{ maxWidth: "560px" }}>
            <iframe
              className="rounded mt-3"
              src="https://www.youtube.com/embed/88A60ki-9d0"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen></iframe>
          </div>
        </Card>
      </Card>
    </OutletCard>
  );
};

export default Settings;
