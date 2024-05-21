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
import { AccountBalance, AccountCircle, Analytics, BrandingWatermark, Category, Chat, Dashboard, ExpandLess, ExpandMore, Inventory, LocationOn, Logout, Person, Report, ReportOff, Settings, Summarize, Support, SupportAgent, UsbRounded, VerifiedUserRounded, Warning } from '@mui/icons-material';
import Image from 'next/image';
import LogoutIcon from '@mui/icons-material/Logout';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const drawerWidth = 240;

function Sidenav(props) {

  const { window } = props;
  const { children } = props;
  const router = useRouter()
  const pathname = usePathname()


  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [isCollapse, setIsCollapse] = React.useState(false);
  const [isCollapseProduct, setIsCollapseProduct] = React.useState(false);
  const [isCollapseUser, setIsCollapseUser] = React.useState(false);
  const [isCollapseComplaint, setIsCollapseComplaint] = React.useState(false);
  const [isCollapseSettings, setIsCollapseSettings] = React.useState(false);
  const [isCollapseReports, setIsCollapseReports] = React.useState(false);


  const [value, setValue] = React.useState(null);

  React.useEffect(() => {
    const storedValue = localStorage.getItem("user");
    if (storedValue) {
      setValue(JSON.parse(storedValue));
    }
  }, []);




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

  };

  const handleCollapseUser = () => {
    setIsCollapseProduct(false);
    setIsCollapseComplaint(false)
    setIsCollapse(false);
    setIsCollapseUser(!isCollapseUser);
    setIsCollapseSettings(false)

  };
  const handleCollapseComplaint = () => {
    setIsCollapseProduct(false);
    setIsCollapseUser(false);
    setIsCollapseComplaint(!isCollapseComplaint);
    setIsCollapse(false);
    setIsCollapseSettings(false)
  };
  const handleCollapseSettings = () => {
    setIsCollapseProduct(false);
    setIsCollapseUser(false);
    setIsCollapseComplaint(false);
    setIsCollapse(false);
    setIsCollapseSettings(!isCollapseSettings)
  };
  const handleCollapse = () => {
    setIsCollapseProduct(false);
    setIsCollapseUser(false);
    setIsCollapseComplaint(false);
    setIsCollapse(!isCollapse);
    setIsCollapseSettings(false)


  };
  const handleCollapseReports = () => {
    setIsCollapseProduct(false);
    setIsCollapseUser(false);
    setIsCollapseComplaint(false);
    setIsCollapse(false);
    setIsCollapseReports(!isCollapseReports);
    setIsCollapseSettings(false)


  };
  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/sign_in")
  }



  const text1 = "ps"
  const drawer = (
    <div>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <img src="/Logo.png" height={40} width={60} alt='logo' className='rounded-lg' />
        </div>
        <div className='font-bold text-xl'>
          {value?.user?.role}
        </div>
      </Toolbar>
      <Divider />

      <ListItem disablePadding onClick={() => { router.push("/dashboard") }} className={pathname.startsWith("/dashboard") ? "bg-[#f1f5f9] text-sky-600 pl-2 rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
        <ListItemButton>
          <ListItemIcon className={pathname.startsWith("/dashboard") ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary={"Dashboard"} />
          {/* {isCollapse ? <ExpandLess /> : <ExpandMore />} */}
        </ListItemButton>
      </ListItem>
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


      {value?.user?.role === "ADMIN" || value?.user?.role === "BRAND" || value?.user?.role === "EMPLOYEE" || value?.user?.role === "SERVICE"
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
          {['Category', 'Product', 'SparePart', 'Complaint Nature'].map((text, index) => (
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
      </Collapse>


      {value?.user?.role === "ADMIN" || value?.user?.role === "BRAND" || value?.user?.role === "EMPLOYEE" || value?.user?.role === "SERVICE"
        ? <ListItem onClick={handleCollapseUser} disablePadding className={pathname.startsWith("/user") ? "bg-[#f1f5f9] text-sky-600 pl-2   rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
          <ListItemButton>
            <ListItemIcon className={pathname.startsWith("/user") ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
              <Person />
            </ListItemIcon>
            <ListItemText primary={"User"} />
            {isCollapseUser ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        : ""}
      <Collapse in={isCollapseUser} timeout={"auto"} unmountOnExit >
        <List className=' '>
          {['Brand', 'Service', 'Dealer', 'Customer', 'Employee'].map((text, index) => (
            <ListItem key={text} disablePadding
              className={pathname.startsWith(`/user/${text.toLowerCase()}`)
                ? '  text-sky-600 pl-4'
                : 'text-slate-700 pl-4'
              }
              onClick={(event) => { text === "User" ? router.push(`/user/${text.toLowerCase()}`) : router.push(`/user/${text.toLowerCase()}`) }}
            >
              <ListItemButton>
                <ListItemIcon className={pathname.startsWith(`/user/${text.toLowerCase()}`) ? "  text-sky-600" : "text-slate-700"}>
                  {text?.toLocaleLowerCase() === "brand" ? <BrandingWatermark /> : <Person />}
                </ListItemIcon>
                <ListItemText sx={{ marginLeft: "-20px" }} primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Collapse>
      {value?.user?.role === "ADMIN" || value?.user?.role === "BRAND" || value?.user?.role === "EMPLOYEE" || value?.user?.role === "SERVICE"
        ? <ListItem onClick={handleCollapseComplaint} disablePadding className={pathname.startsWith("/complaint") ? "bg-[#f1f5f9] text-sky-600 pl-2   rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
          <ListItemButton>
            <ListItemIcon className={pathname.startsWith("/complaint") ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
              <Warning />
            </ListItemIcon>
            <ListItemText primary={"Complaint"} />
            {isCollapseComplaint ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        : ""}
      <Collapse in={isCollapseComplaint} timeout={"auto"} unmountOnExit >
        <List className=' '>
          {['Create', 'All Complaint', 'Asign', 'Close', 'Cancel'].map((text, index) => (
            <ListItem key={text1} disablePadding
              className={
                text === "All Complaint" ? (pathname === "/complaint/allComplaint" ? 'text-sky-600 pl-4' : 'text-slate-700 pl-4') :
                  pathname === `/complaint/${text.toLowerCase()}` ? 'text-sky-600 pl-4' : 'text-slate-700 pl-4'
              }
              onClick={(event) => {

                text === "All Complaint" ? router.push(`/complaint/allComplaint`) :
                  router.push(`/complaint/${text.toLowerCase()}`)
              }}
            >
              <ListItemButton>
                <ListItemIcon
                  className={
                    text === "All Complaint" ? (pathname === "/complaint/allComplaint" ? 'text-sky-600  ' : 'text-slate-700 ') :
                      pathname === `/complaint/${text.toLowerCase()}` ? 'text-sky-600  ' : 'text-slate-700  '
                  }
                >
                  {text1?.toLocaleLowerCase() === "brand" ? <BrandingWatermark /> : <Warning />}
                </ListItemIcon>
                <ListItemText sx={{ marginLeft: "-20px" }} primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Collapse>
      {value?.user?.role === "ADMIN"
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
      </Collapse>
         {value?.user?.role === "ADMIN"
        ? <ListItem onClick={handleCollapseReports} disablePadding className={pathname.startsWith("/reports") ? "bg-[#f1f5f9] text-sky-600 pl-2   rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
          <ListItemButton>
            <ListItemIcon className={pathname.startsWith("/reports") ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
              <Summarize />
            </ListItemIcon>
            <ListItemText primary={"Reports"} />
            {isCollapseReports ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        : ""}
      <Collapse in={isCollapseReports} timeout={"auto"} unmountOnExit >
        <List className=' '>
          {['Service Center'].map((text, index) => (
            <ListItem key={text} disablePadding
              className={
                text === "Service Center" ? (pathname === "/reports/serviceCenter" ? 'text-sky-600 pl-4 ' : 'text-slate-700 pl-4') :
                pathname === `/reports/${text.toLowerCase()}` ? 'text-sky-600 pl-4' : 'text-slate-700 pl-4'
              }
              onClick={(event) => {
                text==="Service Center"?router.push(`/reports/serviceCenter`)
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
    
      {value?.user?.role === "ADMIN" || value?.user?.role === "EMPLOYEE" || value?.user?.role === "SERVICE"
        ? <ListItem disablePadding className={pathname.startsWith("/" + text1.toLocaleLowerCase()) ? "bg-[#f1f5f9] text-sky-600 pl-2 rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
          <ListItemButton>
            <ListItemIcon className={pathname.startsWith("/" + text1.toLocaleLowerCase()) ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
              <AccountBalance />
            </ListItemIcon>
            <ListItemText primary={"Account"} />
            {/* {isCollapse ? <ExpandLess /> : <ExpandMore />} */}
          </ListItemButton>
        </ListItem>
        : ""}
      
      {value?.user?.role === "ADMIN" || value?.user?.role === "BRAND" || value?.user?.role === "EMPLOYEE" || value?.user?.role === "SERVICE"
        ? <ListItem disablePadding className={pathname.startsWith("/" + text1.toLocaleLowerCase()) ? "bg-[#f1f5f9] text-sky-600 pl-2 rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
          <ListItemButton>
            <ListItemIcon className={pathname.startsWith("/" + text1.toLocaleLowerCase()) ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
              <Inventory />
            </ListItemIcon>
            <ListItemText primary={"Inventory"} />
            {/* {isCollapse ? <ExpandLess /> : <ExpandMore />} */}
          </ListItemButton>
        </ListItem>
        : ""}
      {value?.user?.role === "ADMIN"
        ? <ListItem disablePadding className={pathname.startsWith("/" + text1.toLocaleLowerCase()) ? "bg-[#f1f5f9] text-sky-600 pl-2 rounded-tl-full rounded-bl-full" : "text-slate-700 pl-2"}>
          <ListItemButton>
            <ListItemIcon className={pathname.startsWith("/" + text1.toLocaleLowerCase()) ? "bg-[#f1f5f9] text-sky-600" : "text-slate-700"}>
              <Chat />
            </ListItemIcon>
            <ListItemText primary={"Chat"} />
            {/* {isCollapse ? <ExpandLess /> : <ExpandMore />} */}
          </ListItemButton>
        </ListItem>
        : ""}
     

    </div>
  );

  // Remove this const when copying and pasting into your project.ndbh
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
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
            <div className='font-bold text-2xl'  >
              Dashboard
            </div>
            <div className='flex items-center'>
              <div className='font-semibold'>{value?.user?.role}</div>
              <div onClick={handleLogout} className='ms-5 w-[40px] h-[40px] bg-red-600 flex justify-center items-center  text-white  font-bold cursor-pointer rounded-full'>
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
