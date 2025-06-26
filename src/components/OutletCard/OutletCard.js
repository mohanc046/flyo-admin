import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import PropTypes from "prop-types";
import "./OutletCard.scss";

const OutletCard = ({ children, title, subtitle }) => {
  return (
    <Card className="bg-light outlet-container">
      <CardTitle tag="h4" className={title ? "border-bottom px-4" : ""}>
        {title}
      </CardTitle>

      <CardBody className="py-0 px-2">
        <CardSubtitle className="text-muted mb-3">{subtitle || ""}</CardSubtitle>
        <div>{children}</div>
      </CardBody>
    </Card>
  );
};

OutletCard.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.node,
  searchPlaceHolder: PropTypes.string,
  searchOnChange: PropTypes.func,
  searchValue: PropTypes.string,
  searchInputId: PropTypes.string,
  searchInputName: PropTypes.string
};

export default OutletCard;
