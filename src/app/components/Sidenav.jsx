"use client"
import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Collapse } from '@mui/material';
import { AccountBalance, AccountCircle, Analytics, Assignment, BrandingWatermark, Category, Chat, ContactPage, Dashboard, DeveloperMode, ExpandLess, ExpandMore, Feedback, Info, Inventory, LiveHelp, LocalShipping, LocationOn, Logout, NotificationsNone, Payment, Person, Report, ReportOff, Settings, Summarize, Support, SupportAgent, UsbRounded, VerifiedUserRounded, Wallet, Warning, Work } from '@mui/icons-material';
import Image from 'next/image';
import LogoutIcon from '@mui/icons-material/Logout';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { ReactLoader } from './common/Loading';
import http_request from "../../../http-request"

const drawerWidth = 240;

function Sidenav(props) {

  const { window } = props;
  const { children } = props;
  const router = useRouter()
  const pathname = usePathname()

  // console.log(pathname);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [isCollapse, setIsCollapse] = React.useState(false);
  const [isCollapseProduct, setIsCollapseProduct] = React.useState(false);
  const [isCollapseUser, setIsCollapseUser] = React.useState(false);
  const [isCollapseWallet, setIsCollapseWallet] = React.useState(false);
  const [isCollapseComplaint, setIsCollapseComplaint] = React.useState(false);
  const [isCollapseSettings, setIsCollapseSettings] = React.useState(false);
  const [isCollapseReports, setIsCollapseReports] = React.useState(false);
  const [isCollapseSupport, setIsCollapseSupport] = React.useState(false);
  const [isCollapseInventory, setIsCollapseInventory] = React.useState(false);
  const [isCollapseCustomer, setIsCollapseCustomer] = React.useState(false);
  const [isCollapseTechnician, setIsCollapseTechnician] = React.useState(false);

  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);

  const [refresh, setRefresh] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(0);

  const [dashData, setData] = React.useState("");
  const notificationsPerPage = 5;

  React.useEffect(() => {
    const storedValue = localStorage.getItem("user");
    if (storedValue) {
      setValue(JSON.parse(storedValue));
    }
    getAllNotification()
    getAllDashboard()
  }, [refresh]);

  const getAllDashboard = async () => {
    const storedValue = localStorage.getItem("user");
    const user1 = JSON.parse(storedValue);
    try {
    
      const endPoint=user1?.user.role==="ADMIN"? "/dashboardDetails"
      :user1?.user.role==="DEALER"?`/dashboardDetailsByDealerId/${user1?.user?._id}`
      :user1?.user.role==="BRAND"?`/dashboardDetailsByBrandId/${user1?.user?._id}`
      :user1?.user.role==="USER"?`/dashboardDetailsByUserId/${user1?.user?._id}`
      :user1?.user.role==="TECHNICIAN"?`/dashboardDetailsByTechnicianId/${user1?.user?._id}`
      :user1?.user.role==="SERVICE"?`/dashboardDetailsBySeviceCenterId/${user1?.user?._id}`
      :""
      let response = await http_request.get(endPoint)
      let { data } = response;

      setData(data)
    }
    catch (err) {
      console.log(err);
    }
  }
// console.log(dashData);

  const getAllNotification = async () => {
    const storedValue = localStorage.getItem("user");
    const userType = JSON.parse(storedValue)
    try {

      const endPoint = (userType?.user?.role) === "ADMIN" ? `/getAllNotification` : (userType?.user?.role) === "USER" ? `/getNotificationByUserId/${userType?.user?._id}`
        : (userType?.user?.role) === "BRAND" ? `/getNotificationByBrandId/${userType?.user?._id}`
          : (userType?.user?.role) === "SERVICE" ? `/getNotificationByServiceCenterId/${userType?.user?._id}`
            : (userType?.user?.role) === "TECHNICIAN" ? `/getNotificationByTechnicianId/${userType?.user?._id}`
              : (userType?.user?.role) === "DEALER" ? `/getNotificationByDealerId/${userType?.user?._id}`
                : ""
      let response = await http_request.get(endPoint)
      let { data } = response;
      setNotifications(data)
    }
    catch (err) {
      console.log(err);
    }
  }


  const handleNextPage = () => {
    if ((currentPage + 1) * notificationsPerPage < notifications.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const indexOfLastNotification = (currentPage + 1) * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);

  const unreadNoti = value?.user?.role === "ADMIN" ? notifications?.filter((item) => item?.adminStatus === "UNREAD")
    : value?.user?.role === "BRAND" ? notifications?.filter((item) => item?.brandStatus === "UNREAD")
      : value?.user?.role === "SERVICE" ? notifications?.filter((item) => item?.serviceCenterStatus === "UNREAD")
        : value?.user?.role === "TECHNICIAN" ? notifications?.filter((item) => item?.technicianStatus === "UNREAD")
          : value?.user?.role === "USER" ? notifications?.filter((item) => item?.userStatus === "UNREAD")
            : value?.user?.role === "DEALER" ? notifications?.filter((item) => item?.userStatus === "UNREAD")
              : ""


  const handleReadMark = async (id) => {
    const storedValue = localStorage.getItem("user");
    const userType = JSON.parse(storedValue)
    try {

      const status = (userType?.user?.role) === "ADMIN" ? { adminStatus: "READ" }
        : (userType?.user?.role) === "USER" ? { userStatus: "READ" }
          : (userType?.user?.role) === "BRAND" ? { brandStatus: "READ" }
            : (userType?.user?.role) === "SERVICE" ? { serviceCenterStatus: "READ" }
              : (userType?.user?.role) === "TECHNICIAN" ? { technicianStatus: "READ" }
                : (userType?.user?.role) === "DEALER" ? { dealerStatus: "READ" }
                  : ""

      let response = await http_request.patch(`/editNotification/${id}`, status)
      let { data } = response;
      setRefresh(data)
    }
    catch (err) {
      console.log(err);
    }
  }

  const dropdownRef = React.useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };
  const handleCollapseProduct = () => {
    setIsCollapseProduct(!isCollapseProduct);
    setIsCollapse(false);
    setIsCollapseUser(false)
    setIsCollapseComplaint(false)
    setIsCollapseSettings(false)
    setIsCollapseSupport(false)
  };

  const handleCollapseUser = () => {
    setIsCollapseProduct(false);
    setIsCollapseComplaint(false)
    setIsCollapse(false);
    setIsCollapseUser(!isCollapseUser);
    setIsCollapseSettings(false)
    setIsCollapseSupport(false)

  };
  const handleCollapseComplaint = () => {
    setIsCollapseProduct(false);
    setIsCollapseUser(false);
    setIsCollapseComplaint(!isCollapseComplaint);
    setIsCollapse(false);
    setIsCollapseSettings(false)
    setIsCollapseSupport(false)

  };
  const handleCollapseSettings = () => {
    setIsCollapseProduct(false);
    setIsCollapseUser(false);
    setIsCollapseComplaint(false);
    setIsCollapse(false);
    setIsCollapseSettings(!isCollapseSettings)
    setIsCollapseSupport(false)

  };
  const handleCollapse = () => {
    setIsCollapseProduct(false);
    setIsCollapseUser(false);
    setIsCollapseComplaint(false);
    setIsCollapse(!isCollapse);
    setIsCollapseSettings(false)
    setIsCollapseSupport(false)


  };
  const handleCollapseReports = () => {
    setIsCollapseProduct(false);
    setIsCollapseUser(false);
    setIsCollapseComplaint(false);
    setIsCollapse(false);
    setIsCollapseReports(!isCollapseReports);
    setIsCollapseSettings(false)
    setIsCollapseSupport(false)


  };
  const handleCollapseSupport = () => {
    setIsCollapseProduct(false);
    setIsCollapseUser(false);
    setIsCollapseComplaint(false);
    setIsCollapse(false);
    setIsCollapseReports(false);
    setIsCollapseSettings(false)
    setIsCollapseSupport(!isCollapseSupport)


  };
  const handleCollapseInventory = () => {
    setIsCollapseProduct(false);
    setIsCollapseUser(false);
    setIsCollapseComplaint(false);
    setIsCollapse(false);
    setIsCollapseReports(false);
    setIsCollapseSettings(false)
    setIsCollapseSupport(false)
    setIsCollapseInventory(!isCollapseInventory)
  };
  const handleCollapseWallet = () => {
    setIsCollapseProduct(false);
    setIsCollapseUser(false);
    setIsCollapseComplaint(false);
    setIsCollapse(false);
    setIsCollapseReports(false);
    setIsCollapseSettings(false)
    setIsCollapseSupport(false)
    setIsCollapseInventory(false)
    setIsCollapseWallet(!isCollapseWallet)
  };
  const handleCollapseCustomer = () => {
    setIsCollapseProduct(false);
    setIsCollapseUser(false);
    setIsCollapseComplaint(false);
    setIsCollapse(false);
    setIsCollapseReports(false);
    setIsCollapseSettings(false)
    setIsCollapseSupport(false)
    setIsCollapseInventory(false)
    setIsCollapseWallet(false)
    setIsCollapseCustomer(!isCollapseCustomer)
  };
  const handleCollapseTechnician = () => {
    setIsCollapseProduct(false);
    setIsCollapseUser(false);
    setIsCollapseComplaint(false);
    setIsCollapse(false);
    setIsCollapseReports(false);
    setIsCollapseSettings(false)
    setIsCollapseSupport(false)
    setIsCollapseInventory(false)
    setIsCollapseWallet(false)
    setIsCollapseCustomer(false)
    setIsCollapseTechnician(!isCollapseTechnician)
  };
  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/sign_in")
  }



  const primaryText = "#007BFF"
  const secondaryText = "#007BFF"

  const complaints = value?.user?.role === "ADMIN" ? ['Create', 'Bulk Upload', 'Pending', 'Assign', 'In Progress', 'Part Pending', 'Cancel', 'Close', 'All Service'] : value?.user?.role === "BRAND" ? ['Create', 'Bulk Upload', 'Pending', 'Assign', 'In Progress', 'Part Pending', 'Cancel', 'Close', 'All Service'] : value?.user?.role === "SERVICE" ? ['Pending', 'Assign', 'In Progress', 'Part Pending', 'Cancel', 'Close', 'All Service'] : value?.user?.role === "TECHNICIAN" ? ['Assign', 'In Progress', 'Part Pending', 'Cancel', 'Close', 'All Service'] : value?.user?.role === "USER" ? ['Create', 'All Service', 'Pending', 'Assign', 'Close',] : ['Create', 'Pending', 'Assign', 'Close', 'All Service']
  const userSide = value?.user?.role === "ADMIN" ? ['Brand', 'Service', 'Dealer', 'Customer', 'Technician', 'Employee'] : value?.user?.role === "BRAND" ? ['Service', 'Customer'] : []
  const productSide = value?.user?.role === "ADMIN" ? ['Category', 'Product', 'SparePart', 'Complaint Nature',"Warranty"]:value?.user?.role === "BRAND" ? [  'Product', 'SparePart', 'Complaint Nature' ] : ['Product']
  const inventory=value?.user?.role === "ADMIN"?['Sparepart', "Stock", "Order"]:value?.user?.role === "BRAND"?['Sparepart', "Stock", "Order"]:["Stock", "Order"]
  const drawer = (
    <>
      {value ?
        <>
          <div>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <img src="/Logo.png" height={40} width={60} alt='logo' className='rounded-lg' />
              </div>
              <div className='font-bold text-ml'>
                {value?.user?.role}
              </div>
            </Toolbar>
            <Divider />

            <ListItem disablePadding onClick={() => { router.push("/dashboard") }} className={pathname.startsWith("/dashboard") ? "bg-[#f1f5f9] text-sky-600 pl-2 rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
              <ListItemButton>
                <ListItemIcon className={pathname.startsWith("/dashboard") ? "bg-[#f1f5f9] text-[#007BFF]" : "text-slate-700"}>
                  <Dashboard style={{ color: pathname.startsWith('/dashboard') ? '#007BFF' : '#64748b' }} />
                </ListItemIcon  >
                <ListItemText primary={"Dashboard"} />

              </ListItemButton>
            </ListItem>
            {/* {value?.user?.role === "ADMIN" || value?.user?.role === "USER"
              ? <ListItem onClick={handleCollapseProduct} disablePadding className={pathname.startsWith("/product") ? "bg-[#f1f5f9] text-sky-600 pl-2 rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
                <ListItemButton>
                  <ListItemIcon className={pathname.startsWith("/product") ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
                    <AccountBalance />
                  </ListItemIcon>
                  <ListItemText primary={"Products"} />
                  {isCollapseProduct ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              : ""}
            <Collapse in={isCollapseProduct} timeout={300} unmountOnExit>
              <List className=' '>
                {productSide?.map((text, index) => (
                  <ListItem key={text} disablePadding
                    className={
                      text === "Product" ? (pathname === "/product" ? 'text-sky-600 pl-4' : 'text-slate-700 pl-4') :
                        text === "Complaint Nature" ? (pathname === "/product/complaintnature" ? 'text-sky-600 pl-4' : 'text-slate-700 pl-4') :
                          pathname === `/product/${text.toLowerCase()}` ? 'text-sky-600 pl-4' : 'text-slate-700 pl-4'
                    }
                    onClick={(event) => {
                      text === "Product" ? router.push(`/product`) :
                        text === "Complaint Nature" ? router.push(`/product/complaintnature`) :
                          router.push(`/product/${text.toLowerCase()}`)
                    }}
                  >
                    <ListItemButton>
                      <ListItemIcon
                        className={
                          text === "Product" ? (pathname === "/product" ? 'text-sky-600  ' : 'text-slate-700  ') :
                            text === "Complaint Nature" ? (pathname === "/product/complaintnature" ? 'text-sky-600  ' : 'text-slate-700  ') :
                              pathname === `/product/${text.toLowerCase()}` ? 'text-sky-600 ' : 'text-slate-700  '
                        }
                      >
                        {text?.toLowerCase() === "category" ? <Category /> : <SupportAgent />}
                      </ListItemIcon>
                      <ListItemText sx={{ marginLeft: "-20px" }} primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse> */}



            {/* {value?.user?.role === "DEALER"
              ? <ListItem disablePadding onClick={() => { router.push("/wallet") }} className={pathname.startsWith("/wallet") ? "bg-[#f1f5f9] text-sky-600 pl-2 rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
                <ListItemButton>
                  <ListItemIcon className={pathname.startsWith("/wallet") ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
                    <AccountBalance />
                  </ListItemIcon>
                  <ListItemText primary={"Wallet"} />

                </ListItemButton>
              </ListItem>
              : ""} */}
            {/* {value?.user?.role === "ADMIN"
        ? <ListItem disablePadding onClick={() => { router.push("/analytics") }} className={pathname.startsWith("/analytics") ? "bg-[#f1f5f9] text-sky-600 pl-2 rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
          <ListItemButton>
            <ListItemIcon className={pathname.startsWith("/analytics") ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
              <Analytics />
            </ListItemIcon>
            <ListItemText primary={"Analytics"} />
            {isCollapse ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        : "dfdfd"} */}


            {value?.user?.role === "ADMIN"|| value?.user?.role === "BRAND" || value?.user?.role === "USER"
              ? <ListItem onClick={handleCollapseProduct} disablePadding className={pathname.startsWith("/product") ? "bg-[#f1f5f9] text-sky-600 pl-2 rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
                <ListItemButton>
                  <ListItemIcon className={pathname.startsWith("/product") ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
                    <Category style={{ color: pathname.startsWith('/product') ? '#007BFF' : '#64748b' }} />
                  </ListItemIcon>
                  <ListItemText primary={"Products"} />
                  {isCollapseProduct ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              : ""}
            <Collapse in={isCollapseProduct} timeout={300} unmountOnExit>
              <List className=' '>
                {productSide?.map((text, index) => (
                  <ListItem key={text} disablePadding
                    className={
                      text === "Product" ? (pathname === "/product" ? 'text-sky-600 pl-4' : 'text-slate-700 pl-4') :
                        text === "Complaint Nature" ? (pathname === "/product/complaintnature" ? 'text-sky-600 pl-4' : 'text-slate-700 pl-4') :
                          pathname === `/product/${text.toLowerCase()}` ? 'text-sky-600 pl-4' : 'text-slate-700 pl-4'
                    }
                    onClick={(event) => {
                      text === "Product" ? router.push(`/product`) :
                        text === "Complaint Nature" ? router.push(`/product/complaintnature`) :
                          router.push(`/product/${text.toLowerCase()}`)
                    }}
                  >
                    <ListItemButton>
                      <ListItemIcon
                        className={
                          text === "Product" ? (pathname === "/product" ? 'text-sky-600  ' : 'text-slate-700  ') :
                            text === "Complaint Nature" ? (pathname === "/product/complaintnature" ? 'text-sky-600  ' : 'text-slate-700  ') :
                              pathname === `/product/${text.toLowerCase()}` ? 'text-sky-600 ' : 'text-slate-700  '
                        }
                      >
                        <Category
                          style={{
                            color: text === "Product"
                              ? pathname === "/product"
                                ? '#007BFF'
                                : '#64748b' : text === "Complaint Nature" ? pathname === "/product/complaintnature" ? '#007BFF' : '#64748b' : pathname === `/product/${text.toLowerCase()}` ? '#007BFF' : '#64748b'
                          }}

                        />
                      </ListItemIcon>
                      <ListItemText sx={{ marginLeft: "-20px" }} primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>


            {value?.user?.role === "ADMIN" || value?.user?.role === "BRAND"
              ? <ListItem onClick={handleCollapseUser} disablePadding className={pathname.startsWith("/user") ? "bg-[#f1f5f9] text-sky-600 pl-2   rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
                <ListItemButton>
                  <ListItemIcon className={pathname.startsWith("/user") ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
                    <Person style={{ color: pathname.startsWith('/user') ? '#007BFF' : '#64748b' }} />
                  </ListItemIcon>
                  <ListItemText primary={"User"} />
                  {isCollapseUser ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              : ""}
            <Collapse in={isCollapseUser} timeout={"auto"} unmountOnExit >
              <List className=' '>
                {userSide?.map((text, index) => (
                  <ListItem key={text} disablePadding
                    className={pathname.startsWith(`/user/${text.toLowerCase()}`)
                      ? '  text-sky-600 pl-4'
                      : 'text-slate-700 pl-4'
                    }
                    onClick={(event) => { text === "User" ? router.push(`/user/${text.toLowerCase()}`) : router.push(`/user/${text.toLowerCase()}`) }}
                  >
                    <ListItemButton>
                      <ListItemIcon className={pathname.startsWith(`/user/${text.toLowerCase()}`) ? "  text-sky-600" : "text-slate-700"}>
                        {text?.toLocaleLowerCase() === "brand" ? <BrandingWatermark style={{ color: pathname.startsWith(`/user/${text.toLowerCase()}`) ? '#007BFF' : '#64748b' }} /> : <Person style={{ color: pathname.startsWith(`/user/${text.toLowerCase()}`) ? '#007BFF' : '#64748b' }} />}
                      </ListItemIcon>
                      <ListItemText sx={{ marginLeft: "-20px" }} primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
            {value?.user?.role === "ADMIN" || value?.user?.role === "BRAND" || value?.user?.role === "EMPLOYEE" || value?.user?.role === "SERVICE" || value?.user?.role === "USER" || value?.user?.role === "DEALER" || value?.user?.role === "TECHNICIAN"
              ? <ListItem onClick={handleCollapseComplaint} disablePadding className={pathname.startsWith("/complaint") ? "bg-[#f1f5f9] text-sky-600 pl-2   rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
                <ListItemButton>
                  <ListItemIcon className={pathname.startsWith("/complaint") ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
                    <Assignment style={{ color: pathname.startsWith("/complaint") ? '#007BFF' : '#64748b' }} />
                  </ListItemIcon>
                  <ListItemText primary={"Service  "} />
                  {isCollapseComplaint ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              : ""}
            <Collapse in={isCollapseComplaint} timeout={"auto"} unmountOnExit >
              <List className=' '>
                {complaints.map((text, index) => (
                  <ListItem key={index} disablePadding
                    className={
                      text === "All Service" ? (pathname === "/complaint/allComplaint" ? 'text-sky-600 pl-4' : 'text-slate-700 pl-4') :
                        text === "Bulk Upload" ? (pathname === "/complaint/bulkUpload" ? 'text-sky-600 pl-4' : 'text-slate-700 pl-4') :
                          text === "In Progress" ? (pathname === "/complaint/inprogress" ? 'text-sky-600 pl-4' : 'text-slate-700 pl-4') :
                            text === "Part Pending" ? (pathname === "/complaint/partpending" ? 'text-sky-600 pl-4' : 'text-slate-700 pl-4') :
                              pathname === `/complaint/${text.toLowerCase()}` ? 'text-sky-600 pl-4' : 'text-slate-700 pl-4'
                    }
                    onClick={(event) => {

                      text === "All Service" ? router.push(`/complaint/allComplaint`) :
                        text === "Bulk Upload" ? router.push(`/complaint/bulkUpload`) :
                          text === "In Progress" ? router.push(`/complaint/inprogress`) :
                            text === "Part Pending" ? router.push(`/complaint/partpending`) :
                              router.push(`/complaint/${text.toLowerCase()}`)
                    }}
                  >
                    <ListItemButton>
                      <ListItemIcon
                        className={
                          text === "All Service" ? (pathname === "/complaint/allComplaint" ? 'text-sky-600  ' : 'text-slate-700 ') :
                            text === "Bulk Upload" ? (pathname === "/complaint/bulkUpload" ? 'text-sky-600  ' : 'text-slate-700  ') :
                              text === "In Progress" ? (pathname === "/complaint/inprogress" ? 'text-sky-600  ' : 'text-slate-700  ') :
                                text === "Part Pending" ? (pathname === "/complaint/partpending" ? 'text-sky-600  ' : 'text-slate-700 ') :
                                  pathname === `/complaint/${text.toLowerCase()}` ? 'text-sky-600  ' : 'text-slate-700  '
                        }
                      >
                        <Assignment style={{
                          color: text === "All Service"
                            ? pathname === "/complaint/allComplaint"
                              ? '#007BFF' // text-sky-600
                              : '#64748b' // text-slate-700
                            : text === "Bulk Upload"
                              ? pathname === "/complaint/bulkUpload"
                                ? '#007BFF' // text-sky-600
                                : '#64748b' // text-slate-700
                              : text === "In Progress"
                                ? pathname === "/complaint/inprogress"
                                  ? '#007BFF' // text-sky-600
                                  : '#64748b' // text-slate-700
                                : text === "Part Pending"
                                  ? pathname === "/complaint/partpending"
                                    ? '#007BFF' // text-sky-600
                                    : '#64748b' // text-slate-700
                                  : pathname === `/complaint/${text.toLowerCase()}`
                                    ? '#007BFF' // text-sky-600
                                    : '#64748b', // text-slate-700

                        }} /> 
                      </ListItemIcon>
                      <ListItemText sx={{ marginLeft: "-20px" }} primary={text} /> 
                      {text==="Pending"?dashData?.complaints?.pending
                      :text==="Assign"?dashData?.complaints?.assign
                      :text==="In Progress"?dashData?.complaints?.inProgress
                      :text==="Part Pending"?dashData?.complaints?.partPending
                      :text==="Cancel"?dashData?.complaints?.cancel
                      :text==="Close"?dashData?.complaints?.complete
                      :text==="All Service"?dashData?.complaints?.allComplaints
                      :""}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
            {/* {value?.user?.role === "ADMIN"
              ? <ListItem onClick={handleCollapseSettings} disablePadding className={pathname.startsWith("/settings") ? "bg-[#f1f5f9] text-sky-600 pl-2   rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
                <ListItemButton>
                  <ListItemIcon className={pathname.startsWith("/settings") ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
                    <Settings />
                  </ListItemIcon>
                  <ListItemText primary={"Settings"} />
                  {isCollapseSettings ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              : ""}
            <Collapse in={isCollapseSettings} timeout={"auto"} unmountOnExit >
              <List className=' '>
                {['Location'].map((text, index) => (
                  <ListItem key={text} disablePadding
                    className={
                      pathname === `/settings/${text.toLowerCase()}` ? 'text-sky-600 pl-4' : 'text-slate-700 pl-4'
                    }
                    onClick={(event) => {
                      router.push(`/settings/${text.toLowerCase()}`)
                    }}
                  >
                    <ListItemButton>
                      <ListItemIcon
                        className={
                          pathname === `/settings/${text.toLowerCase()}` ? 'text-sky-600  ' : 'text-slate-700  '
                        }
                      >
                        {text?.toLocaleLowerCase() === "location" ? <LocationOn /> : <Warning />}
                      </ListItemIcon>
                      <ListItemText sx={{ marginLeft: "-20px" }} primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse> */}
            {/* {value?.user?.role === "DEALER"
              ? <ListItem onClick={handleCollapseReports} disablePadding className={pathname.startsWith("/reports") ? "bg-[#f1f5f9] text-sky-600 pl-2   rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
                <ListItemButton>
                  <ListItemIcon className={pathname.startsWith("/reports") ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
                    <Summarize />
                  </ListItemIcon>
                  <ListItemText primary={"Reports"} />
                  {isCollapseReports ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              : ""} */}
            <Collapse in={isCollapseReports} timeout={"auto"} unmountOnExit >
              <List className=' '>
                {['Service Center'].map((text, index) => (
                  <ListItem key={text} disablePadding
                    className={
                      text === "Service Center" ? (pathname === "/reports/serviceCenter" ? 'text-sky-600 pl-4 ' : 'text-slate-700 pl-4') :
                        pathname === `/reports/${text.toLowerCase()}` ? 'text-sky-600 pl-4' : 'text-slate-700 pl-4'
                    }
                    onClick={(event) => {
                      text === "Service Center" ? router.push(`/reports/serviceCenter`)
                        : router.push(`/reports/${text.toLowerCase()}`)
                    }}
                  >
                    <ListItemButton>
                      <ListItemIcon
                        className={
                          text === "Service Center" ? (pathname === "/reports/serviceCenter" ? 'text-sky-600  ' : 'text-slate-700  ') :

                            pathname === `/reports/${text.toLowerCase()}` ? 'text-sky-600  ' : 'text-slate-700  '
                        }
                      >
                        {text?.toLocaleLowerCase() === "service center" ? <Person /> : <Warning />}
                      </ListItemIcon>
                      <ListItemText sx={{ marginLeft: "-20px" }} primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
            {value?.user?.role === "ADMIN" || value?.user?.role === "SERVICE" || value?.user?.role === "DEALER"
              ? <ListItem onClick={handleCollapseWallet} disablePadding className={pathname.startsWith("/wallet") ? "bg-[#f1f5f9] text-sky-600 pl-2   rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
                <ListItemButton>
                  <ListItemIcon className={pathname.startsWith("/wallet") ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
                    <AccountBalance style={{ color: pathname.startsWith("/wallet") ? '#007BFF' : '#64748b' }} />
                  </ListItemIcon>
                  <ListItemText primary={"Wallet"} />
                  {isCollapseUser ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              : ""}
            <Collapse in={isCollapseWallet} timeout={"auto"} unmountOnExit >
              <List className=' '>
                {["Bank Details", "Transactions"]?.map((text, index) => (
                  <ListItem key={text} disablePadding
                    className={text === "Bank Details" ? (pathname === "/wallet/bankDetails" ? 'text-sky-600 pl-4' : 'text-slate-700 pl-4') :
                      pathname === `/wallet/${text.toLowerCase()}` ? 'text-sky-600 pl-4' : 'text-slate-700 pl-4'
                    }
                    onClick={(event) => { text === "Bank Details" ? router.push(`/wallet/bankDetails`) : router.push(`/wallet/${text.toLowerCase()}`) }}
                  >
                    <ListItemButton>
                      <ListItemIcon className={text === "Bank Details" ? (pathname === "/wallet/bankDetails" ? 'text-sky-600  ' : 'text-slate-700  ') :
                        pathname === `/wallet/${text.toLowerCase()}` ? 'text-sky-600  ' : 'text-slate-700  '
                      }>
                        <AccountBalance style={{
                          color: text === "Bank Details"
                            ? pathname === "/wallet/bankDetails"
                              ? '#007BFF' // text-sky-600
                              : '#64748b' // text-slate-700
                            : pathname === `/wallet/${text.toLowerCase()}`
                              ? '#007BFF' // text-sky-600
                              : '#64748b' // text-slate-700
                        }} />
                      </ListItemIcon>
                      <ListItemText sx={{ marginLeft: "-20px" }} primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
            {value?.user?.role === "USER" || value?.user?.role === "ADMIN" || value?.user?.role === "BRAND" || value?.user?.role === "SERVICE" || value?.user?.role === "TECHNICIAN"
              ?
              <ListItem onClick={(event) => {
                router.push(`/feedback`)
              }}
                disablePadding className={pathname.startsWith("/feedback") ? "bg-[#f1f5f9] text-sky-600 pl-2 rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
                <ListItemButton>
                  <ListItemIcon className={pathname.startsWith("/feedback") ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
                    <Feedback style={{ color: pathname.startsWith("/feedback") ? '#007BFF' : '#64748b' }} />
                  </ListItemIcon>
                  <ListItemText primary={"Feedback"} />
                  {/* {isCollapse ? <ExpandLess /> : <ExpandMore />} */}
                </ListItemButton>
              </ListItem>
              : ""
            }
            {value?.user?.role === "TECHNICIAN"
              ?
              <>

                <ListItem onClick={(event) => {
                  router.push(`/skillDevelopment`)
                }}
                  disablePadding className={pathname.startsWith("/skillDevelopment") ? "bg-[#f1f5f9] text-sky-600 pl-2 rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
                  <ListItemButton>
                    <ListItemIcon className={pathname.startsWith("/skillDevelopment") ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
                      <DeveloperMode style={{ color: pathname.startsWith("/skillDevelopment") ? '#007BFF' : '#64748b' }} />
                    </ListItemIcon>
                    <ListItemText primary={"Skill Development"} />

                  </ListItemButton>
                </ListItem>
                <ListItem onClick={(event) => {
                  router.push(`/performance`)
                }}
                  disablePadding className={pathname.startsWith("/performance") ? "bg-[#f1f5f9] text-sky-600 pl-2 rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
                  <ListItemButton>
                    <ListItemIcon className={pathname.startsWith("/performance") ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
                      <Analytics style={{ color: pathname.startsWith("/performance") ? '#007BFF' : '#64748b' }} />
                    </ListItemIcon>
                    <ListItemText primary={"Performance"} />

                  </ListItemButton>
                </ListItem>
              </>
              : ""
            }


            {value?.user?.role === "ADMIN" || value?.user?.role === "USER" || value?.user?.role === "DEALER"
              ? <ListItem onClick={handleCollapseSupport} disablePadding className={pathname.startsWith("/support") ? "bg-[#f1f5f9] text-sky-600 pl-2   rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
                <ListItemButton>
                  <ListItemIcon className={pathname.startsWith("/support") ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
                    <Support style={{ color: pathname.startsWith("/support") ? '#007BFF' : '#64748b' }} />
                  </ListItemIcon>
                  <ListItemText primary={"Support"} />
                  {isCollapseSupport ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              : ""}
            <Collapse in={isCollapseSupport} timeout={"auto"} unmountOnExit >
              <List className=' '>
                {['Knowledge', "Contact", "Chat"].map((text, index) => (
                  <ListItem key={text} disablePadding
                    className={
                      pathname === `/support/${text.toLowerCase()}` ? 'text-sky-600 pl-4 ' : 'text-slate-700 pl-4'
                    }
                    onClick={(event) => {
                      router.push(`/support/${text.toLowerCase()}`)
                    }}
                  >
                    <ListItemButton>
                      <ListItemIcon
                        className={
                          pathname === "/support/serviceCenter" ? 'text-sky-600  ' : 'text-slate-700  '}
                      >
                        {text?.toLocaleLowerCase() === "chat" ? <LiveHelp style={{ color: pathname.startsWith(`/support/${text.toLowerCase()}`) ? '#007BFF' : '#64748b' }} /> : text?.toLocaleLowerCase() === "knowledge" ? <Info style={{ color: pathname.startsWith(`/support/${text.toLowerCase()}`) ? '#007BFF' : '#64748b' }} /> : <ContactPage style={{ color: pathname.startsWith(`/support/${text.toLowerCase()}`) ? '#007BFF' : '#64748b' }} />}
                      </ListItemIcon>
                      <ListItemText sx={{ marginLeft: "-20px" }} primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
            {value?.user?.role === "ADMIN" || value?.user?.role === "BRAND" ||    value?.user?.role === "SERVICE"
              ?

              <ListItem onClick={handleCollapseInventory} disablePadding className={pathname.startsWith("/inventory") ? "bg-[#f1f5f9] text-sky-600 pl-2   rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
                <ListItemButton>
                  <ListItemIcon className={pathname.startsWith("/inventory") ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
                    <Inventory style={{ color: pathname.startsWith("/inventory") ? '#007BFF' : '#64748b' }} />
                  </ListItemIcon>
                  <ListItemText primary={"Inventory"} />
                  {isCollapseInventory ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              : ""}
            <Collapse in={isCollapseInventory} timeout={"auto"} unmountOnExit >
              <List className=' '>
                {inventory?.map((text, index) => (
                  <ListItem key={text} disablePadding
                    className={
                      pathname === `/inventory/${text.toLowerCase()}` ? 'text-sky-600 pl-4 ' : 'text-slate-700 pl-4'
                    }
                    onClick={(event) => {
                      router.push(`/inventory/${text.toLowerCase()}`)
                    }}
                  >
                    <ListItemButton>
                      <ListItemIcon
                        className={
                          pathname === `/inventory/${text.toLowerCase()}` ? 'text-sky-600  ' : 'text-slate-700  '}
                      >

                        {text?.toLocaleLowerCase() === "sparepart" ? <Category style={{ color: pathname.startsWith(`/inventory/${text.toLowerCase()}`) ? '#007BFF' : '#64748b' }} /> : text?.toLocaleLowerCase() === "stock" ? <Inventory style={{ color: pathname.startsWith(`/inventory/${text.toLowerCase()}`) ? '#007BFF' : '#64748b' }} /> : <LocalShipping style={{ color: pathname.startsWith(`/inventory/${text.toLowerCase()}`) ? '#007BFF' : '#64748b' }} />}
                      </ListItemIcon>
                      <ListItemText sx={{ marginLeft: "-20px" }} primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
            {value?.user?.role === "SERVICE1" || value?.user?.role === "TECHNICIAN1"
              ? <ListItem onClick={handleCollapseCustomer} disablePadding className={`pl-2 ${pathname.startsWith("/user/customer")
                ? "bg-[#f1f5f9] text-sky-600 pl-2   rounded-tl-full rounded-bl-full"
                : pathname.startsWith("/feedback")
                  ? "bg-[#f1f5f9] text-sky-600 pl-2   rounded-tl-full rounded-bl-full"
                  : "text-slate-700"
                }`}>
                <ListItemButton>
                  <ListItemIcon className={pathname.startsWith("/user/customer") ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
                    <Person style={{ color: pathname.startsWith("/user/customer") || pathname.startsWith("/feedback") ? '#007BFF' : '#64748b' }} />
                  </ListItemIcon>
                  <ListItemText primary={"Customer"} />
                  {isCollapseCustomer ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              : ""}
            <Collapse in={isCollapseCustomer} timeout={"auto"} unmountOnExit >
              <List className=' '>
                {["Customer", "Feedback"]?.map((text, index) => (
                  <ListItem key={text} disablePadding
                    className={text === "Customer" ? (pathname === "/user/customer" ? 'text-sky-600 pl-4' : 'text-slate-700 pl-4') :
                      pathname === `/feedback` ? 'text-sky-600 pl-4' : 'text-slate-700 pl-4'
                    }
                    onClick={(event) => { text === "Customer" ? router.push(`/user/customer`) : router.push(`/${text.toLowerCase()}`) }}
                  >
                    <ListItemButton>
                      <ListItemIcon style={{
                        color: text === "Customer"
                          ? pathname === "/user/customer"
                            ? '#007BFF' // text-sky-600
                            : '#64748b' // text-slate-700
                          : pathname === `/feedback`
                            ? '#007BFF' // text-sky-600
                            : '#64748b' // text-slate-700
                      }}>
                        <Person />
                      </ListItemIcon>
                      <ListItemText sx={{ marginLeft: "-20px" }} primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>



            {value?.user?.role === "SERVICE"
              ? <ListItem onClick={handleCollapseTechnician} disablePadding className={`pl-2 ${pathname.startsWith("/user/technician")
                ? "bg-[#f1f5f9] text-sky-600 pl-2   rounded-tl-full rounded-bl-full"
                : pathname.startsWith("/feedback")
                  ? "bg-[#f1f5f9] text-sky-600 pl-2   rounded-tl-full rounded-bl-full"
                  : "text-slate-700"
                }`}>
                <ListItemButton>
                  <ListItemIcon className={pathname.startsWith("/user/technician") ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
                    <Person style={{ color: pathname.startsWith("/user/technician") ? '#007BFF' : '#64748b' }} />
                  </ListItemIcon>
                  <ListItemText primary={"Technician"} />
                  {isCollapseTechnician ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              : ""}
            <Collapse in={isCollapseTechnician} timeout={"auto"} unmountOnExit >
              <List className=' '>
                {["Technician List", "Workload"]?.map((text, index) => (
                  <ListItem key={text} disablePadding
                    className={text === "Technician List" ? (pathname === "/user/technician" ? 'text-sky-600 pl-4' : 'text-slate-700 pl-4') :
                      pathname === `/user/technician/workload` ? 'text-sky-600 pl-4' : 'text-slate-700 pl-4'
                    }
                    onClick={(event) => { text === "Technician List" ? router.push(`/user/technician`) : router.push(`/user/technician/workload`) }}
                  >
                    <ListItemButton>
                      <ListItemIcon className={text === "Technician List" ? (pathname === "/user/technician" ? 'text-sky-600  ' : 'text-slate-700  ') :
                        pathname === `/user/technician/workload` ? 'text-sky-600  ' : 'text-slate-700  '
                      }>
                        <Work style={{
                          color: text === "Technician List"
                            ? pathname === "/user/technician"
                              ? '#007BFF' // text-sky-600
                              : '#64748b' // text-slate-700
                            : pathname === `/user/technician/workload`
                              ? '#007BFF' // text-sky-600
                              : '#64748b' // text-slate-700
                        }} />
                      </ListItemIcon>
                      <ListItemText sx={{ marginLeft: "-20px" }} primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
            {/* {value?.user?.role === "ADMIN" || value?.user?.role === "BRAND" || value?.user?.role === "SERVICE" */}
            <ListItem disablePadding
              onClick={(event) => {
                router.push(`/notification`)
              }}
              className={pathname.startsWith("/notification") ? "bg-[#f1f5f9] text-sky-600 pl-2 rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
              <ListItemButton>
                <ListItemIcon className={pathname.startsWith("/notification") ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
                  <NotificationsNone style={{ color: pathname.startsWith("/notification") ? '#007BFF' : '#64748b' }} />
                </ListItemIcon>
                <ListItemText primary={"Notification"} />
                {/* {isCollapse ? <ExpandLess /> : <ExpandMore />} */}
              </ListItemButton>
            </ListItem>
            {/* : ""} */}
            {value?.user?.role === "ADMIN" || value?.user?.role === "BRAND" || value?.user?.role === "DEALER"
              ? <ListItem onClick={(event) => {
                router.push(`/reports`)
              }} disablePadding className={pathname.startsWith("/reports") ? "bg-[#f1f5f9] text-sky-600 pl-2 rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
                <ListItemButton>
                  <ListItemIcon className={pathname.startsWith("/reports") ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
                    <Report style={{ color: pathname.startsWith("/reports") ? '#007BFF' : '#64748b' }} />
                  </ListItemIcon>
                  <ListItemText primary={"Report & Analysis"} />
                  {/* {isCollapse ? <ExpandLess /> : <ExpandMore />} */}
                </ListItemButton>
              </ListItem>
              : ""}




          </div>
        </>
        : <ReactLoader />
      }
    </>
  );

  // Remove this const when copying and pasting into your project.ndbh
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      {value ?
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar
            position="fixed"
            sx={{
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              ml: { sm: `${drawerWidth}px` },
              bgcolor: "#ffffff",
              color: "#2F2F2F"
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <div className='w-full flex justify-between'>
                <div className='flex'>
                  <div className='font-bold text-xl'  >
                    Dashboard
                  </div>
                  {/* <div className='font-bold text-xl ms-8 flex items-center'  >
                    <Wallet fontSize='large' color='secondary' />
                    <div className='text-sm'>1000.0 INR</div>
                  </div> */}
                </div>
                <div className='flex items-center'>
                  <div className='font-semibold'>{value?.user?.role === "SERVICE" ? (value?.user?.serviceCenterName) : value?.user?.role === "BRAND" ? (value?.user?.brandName) : value?.user?.name}</div>
                  <div onClick={() => {
                    router.push(`/profile/${value?.user?._id}`)
                  }}
                    className='ms-5 w-[30px] h-[30px] bg-blue-600 flex justify-center items-center  text-white  font-bold cursor-pointer rounded-full'>
                    <Person />
                  </div>
                  <div className='relative' ref={dropdownRef}>
                    <div
                      className='ms-5 w-[30px] h-[30px] bg-yellow-600 flex justify-center items-center text-white font-bold cursor-pointer rounded-full'
                      onClick={toggleDropdown}
                    >
                      <NotificationsNone />
                      {unreadNoti?.length > 0 && (
                        <div className="absolute -top-1 -right-1 bg-white text-red-400 px-2 py-1 rounded-full text-[10px]">
                          {unreadNoti?.length}
                        </div>
                      )}
                    </div>
                    {isOpen && (
                      <div className='absolute right-0 mt-2 w-[420px] bg-white rounded-md shadow-lg z-20'>
                        <div className='p-2  '>
                          {currentNotifications.length > 0 ? (
                            currentNotifications.map((notification, i) => (
                              <div key={notification?._id} className='p-2 flex justify-left items-center'>
                                <div className='  me-3'>
                                  <div className=' flex justify-center items-center bg-slate-400  rounded-full w-[30px] h-[30px] text-white'>
                                    {i + 1 + currentPage * notificationsPerPage}
                                  </div>
                                </div>
                                <div className='flex  border-b'>
                                  <div>
                                    {notification?.message}
                                  </div>
                                  {(value?.user?.role === "ADMIN" ? notification?.adminStatus === "UNREAD"
                                    : value?.user?.role === "BRAND" ? notification?.brandStatus === "UNREAD"
                                      : value?.user?.role === "USER" ? notification?.userStatus === "UNREAD"
                                        : value?.user?.role === "SERVICE" ? notification?.serviceCenterStatus === "UNREAD"
                                          : value?.user?.role === "TECHNICIAN" ? notification?.technicianStatus === "UNREAD"
                                            : value?.user?.role === "DEALER" ? notification?.userStatus === "UNREAD"
                                              : ""
                                  ) && (
                                      <div>
                                        <button onClick={() => handleReadMark(notification?._id)} className="bg-green-500 hover:bg-green-700 text-white font-medium py-1 px-2 rounded">
                                          Mark_Read
                                        </button>
                                      </div>
                                    )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className='p-2 text-center'>No notifications</div>
                          )}
                          <div className='p-2 flex justify-between'>
                            <button
                              onClick={handlePrevPage}
                              className={`font-medium py-1 px-2 rounded ${currentPage === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'
                                }`}
                              disabled={currentPage === 0}
                            >
                              Previous
                            </button>
                            <button
                              onClick={handleNextPage}
                              className={`font-medium py-1 px-2 rounded ${(currentPage + 1) * notificationsPerPage >= notifications.length ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'
                                }`}
                              disabled={(currentPage + 1) * notificationsPerPage >= notifications.length}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                  <div onClick={handleLogout} className='ms-5 w-[30px] h-[30px] bg-red-600 flex justify-center items-center  text-white  font-bold cursor-pointer rounded-full'>
                    <Logout fontSize='large' className='pl-2' />
                  </div>
                </div>
              </div>
            </Toolbar>
          </AppBar>
          <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
          >
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onTransitionEnd={handleDrawerTransitionEnd}
              onClose={handleDrawerClose}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
            >
              {drawer}
            </Drawer>
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
              open
            >
              {drawer}
            </Drawer>
          </Box>
          <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
          >
            <Toolbar />
            <main>{children}</main>
          </Box>
        </Box>
        : <div className='h-[600px] flex justify-center items-center'>
          <ReactLoader />
        </div>
      }
    </>
  );
}

Sidenav.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
  children: PropTypes.array,
};

export default Sidenav;
