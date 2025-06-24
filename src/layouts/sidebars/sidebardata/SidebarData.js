import * as Icon from "react-feather";

const SidebarData = [
  {
    title: "Dashboard",
    href: "/home",
    icon: <Icon.Home />,
    id: 1,
    collapisble: false
  },
  {
    title: "Orders",
    href: "/order-list",
    icon: <Icon.ShoppingCart />,
    id: 2,
    collapisble: false
  },
  {
    title: "Products",
    href: "/product-list",
    icon: <Icon.Box />,
    id: 3,
    collapisble: false
  },
  {
    title: "Edit Shop",
    href: "/online-shop",
    icon: <Icon.ShoppingBag />,
    id: 4,
    collapisble: false
  },
  {
    title: "Payments",
    href: "/payments",
    icon: <Icon.CreditCard />,
    id: 5,
    collapisble: false
  },
  {
    title: "Customers",
    href: "/customers",
    icon: <Icon.Users />,
    id: 6,
    collapisble: false
  },
    {
    title: "Subscription",
    href: "/subscription",
    icon: <Icon.Users />,
    id: 11,
    collapisble: false
  },
  {
    title: "Plugins",
    href: "/plugins",
    icon: <Icon.Package />,
    id: 7,
    collapisble: false
  },
  {
    title: "Discounts",
    href: "/discounts",
    icon: <Icon.Percent />,
    id: 8,
    collapisble: false
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Icon.Settings />,
    id: 9,
    collapisble: false
  },
  {
    title: "Sign Out",
    href: "/sign-out",
    icon: <Icon.LogOut />,
    id: 10,
    collapisble: false
  }
];

export default SidebarData;
