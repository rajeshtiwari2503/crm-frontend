"use client"
import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogTitle
} from '@mui/material';
import { Add, Delete, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { ReactLoader } from '@/app/components/common/Loading';
import ProductWarrantyForm from './addWarranty';
import { ConfirmBox } from '@/app/components/common/ConfirmBox';
import http_request from '.././../../../http-request';
import { ToastMessage } from '@/app/components/common/Toastify';
import { useUser } from '@/app/components/UserContext';
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const ProductWarrantyPage = (props) => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [confirmBoxView, setConfirmBoxView] = useState(false);
  const [cateId, setCateId] = useState("");
  const [page, setPage] = useState(0); // Set initial page to 0
  const [totalPages, setTotalPages] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState('desc');
  const [sortBy, setSortBy] = useState('createdAt');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [brandData, setBrandData] = useState([]);


  const { user } = useUser()

  useEffect(() => {
    fetchProductWarranty();
  }, [page, rowsPerPage, user]); // Fetch data when page or rowsPerPage changes

  const fetchProductWarranty = async () => {



    const reqData = user?.user?.role === "ADMIN" ? `/getAllProductWarrantyWithPage?page=${page + 1}&limit=${rowsPerPage}` : user?.user?.role === "BRAND EMPLOYEE" ? `/getAllProductWarrantyByIdWithPage/${user?.user?.brandId}?page=${page + 1}&limit=${rowsPerPage}` : `/getAllProductWarrantyByIdWithPage/${user?.user?._id}?page=${page + 1}&limit=${rowsPerPage}`
    try {
      setLoading(true);
      const response = await http_request.get(
        reqData
      );
      const { data } = response;
      const dataPP = data?.data?.map((item, index) => ({ ...item, i: index + 1 }));
      setData(dataPP || []);
      setLoading(false);
      setTotalPages(data?.totalRecords || 0); // Total records for pagination
    } catch (err) {
      console.error("Error fetching data:", err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {


    getAllProductWarrantyByBrandStickers()
  }, [])
  const getAllProductWarrantyByBrandStickers = async () => {
    try {
      let response = await http_request.get("/getAllProductWarrantyByBrandStickers")
      let { data } = response;
      // console.log("data", data);

      setBrandData(data?.data)
    }
    catch (err) {
      console.log(err);

    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage); // Update the page number when user clicks next or prev
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Update rows per page
    setPage(0); // Reset page to 0 when changing rows per page
  };

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  const sortedData = stableSort(data, getComparator(sortDirection, sortBy));

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleAdd = (row) => {
    setEditData(row);
    setEditModalOpen(true);
  };

  const handleDetails = (id) => {
    router.push(`/product/warranty/details/${id}`);
  };

  const deleteData = async () => {
    try {
      let response = await http_request.deleteData(`/deleteProductWarranty/${cateId}`);
      let { data } = response;
      setConfirmBoxView(false);
      ToastMessage(data);
      props?.RefreshData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = (id) => {
    setCateId(id);
    setConfirmBoxView(true);
  };



  return (
    <div>
      <Toaster />
     {user.user?.role==="ADMIN"?
      <div className=" rounded-xl bg-gray-100 flex flex-col items-center py-5 ">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Brand Stickers Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full p-4 ">
          {brandData?.map((brand) => (
            <div
              key={brand.brandId}
              onClick={() => router.push(`/product/warranty/byBrand/${brand?.brandId}`)}
              className="bg-white cursor-pointer shadow-md rounded-xl p-4 border border-gray-200 transition-transform transform hover:scale-105"
            >
              <div className='flex justify-between items-center'>
                <div className="text-xl font-semibold text-gray-800 text-center">
                  {brand.brandName.length > 20 ? brand.brandName.substring(0, 10) + "..." : brand.brandName}
                </div>

                <div className="text-3xl font-bold text-blue-600">{brand.totalStickers}</div>


              </div>
            </div>
          ))}
        </div>
      </div>
      :""}
      <div className="flex justify-between items-center mb-3">
        <div className="font-bold text-2xl">Warranty Information</div>


        <div onClick={handleAdd} className="flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center">
          <Add style={{ color: "white" }} />
          <div className="ml-2">Add Warranty</div>
        </div>
      </div>

      {loading === true ? (
        <div className="flex-grow flex justify-center items-center">
          <ReactLoader />
        </div>
      ) : (
        <>
          <TableContainer component={Paper} className="flex-grow">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === '_id'}
                      direction={sortDirection}
                      onClick={() => handleSort('_id')}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'brandName'}
                      direction={sortDirection}
                      onClick={() => handleSort('brandName')}
                    >
                      Brand Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'productName'}
                      direction={sortDirection}
                      onClick={() => handleSort('productName')}
                    >
                      Product Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'numberOfGenerate'}
                      direction={sortDirection}
                      onClick={() => handleSort('numberOfGenerate')}
                    >
                      Number of QR
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'warrantyInDays'}
                      direction={sortDirection}
                      onClick={() => handleSort('warrantyInDays')}
                    >
                      Warranty Days
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'year'}
                      direction={sortDirection}
                      onClick={() => handleSort('year')}
                    >
                      Batch No.
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'createdAt'}
                      direction={sortDirection}
                      onClick={() => handleSort('createdAt')}
                    >
                      Created At
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData?.map((row) => (
                  <TableRow key={row.i} hover>
                    <TableCell>{row.i}</TableCell>
                    <TableCell>{row.brandName}</TableCell>
                    <TableCell>{row.productName}</TableCell>
                    <TableCell>{row.numberOfGenerate}</TableCell>
                    <TableCell>{row.warrantyInDays}</TableCell>
                    <TableCell>{row?.records[0]?.batchNo}</TableCell>
                    <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="flex">
                      <IconButton aria-label="view" onClick={() => handleDetails(row._id)}>
                        <Visibility color="primary" />
                      </IconButton>
                      {props?.user?.role === "ADMIN" &&
                        <IconButton aria-label="delete" onClick={() => handleDelete(row._id)}>
                          <Delete color="error" />
                        </IconButton>
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalPages} // Total records to display
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      <Dialog open={editModalOpen} onClose={handleEditModalClose}>
        <DialogTitle>{editData?._id ? "Edit Product Warranty" : "Add Product Warranty"}</DialogTitle>
        <DialogContent>
          <ProductWarrantyForm
            brand={props?.brand}
            product={props?.product}
            existingProduct={editData}
            RefreshData={props?.RefreshData}
            user={props?.user}
            onClose={handleEditModalClose}
          />
        </DialogContent>
      </Dialog>

      <ConfirmBox bool={confirmBoxView} setConfirmBoxView={setConfirmBoxView} onSubmit={deleteData} />
    </div>
  );
};


export default ProductWarrantyPage;



// import React, { useEffect, useState } from "react";
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
//   TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogTitle,
//   MenuItem, Select, FormControl, InputLabel
// } from "@mui/material";
// import { Add, Delete, Visibility } from "@mui/icons-material";
// import { useRouter } from "next/navigation";
// import { Toaster } from "react-hot-toast";
// import { ReactLoader } from "@/app/components/common/Loading";
// import ProductWarrantyForm from "./addWarranty";
// import { ConfirmBox } from "@/app/components/common/ConfirmBox";
// import http_request from ".././../../../http-request";
// import { ToastMessage } from "@/app/components/common/Toastify";
// import { useUser } from "@/app/components/UserContext";

// const ProductWarrantyPage = (props) => {
//   const router = useRouter();
//   const [data, setData] = useState([]);
//   const [confirmBoxView, setConfirmBoxView] = useState(false);
//   const [cateId, setCateId] = useState("");
//   const [page, setPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [sortDirection, setSortDirection] = useState("desc");
//   const [sortBy, setSortBy] = useState("createdAt");
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedBrand, setSelectedBrand] = useState("");
//   const [brands, setBrands] = useState([])
//   const { user } = useUser();

//   useEffect(() => {
//     fetchProductWarranty();
//   }, [page, rowsPerPage, user]);
//   useEffect(() => {
//     if (brands.length === 0) {
//       getAllBrand(); // Fetch brands if not loaded
//     }
//   }, [brands]);
//   const getAllBrand = async () => {
//     try {
//       let response = await http_request.get("/getAllBrand")
//       let { data } = response;

//       setBrands(data)
//     }
//     catch (err) {
//       console.log(err);
//     }
//   }
//   const fetchProductWarranty = async () => {

// console.log("selectedBrand",selectedBrand);

// let reqData = "";  // Declare reqData globally

// if (selectedBrand) {
//   console.log("Selected Brand:", selectedBrand); // Debugging log
//   const selectedBrandId = brands.find(brand => brand.brandName.trim() === selectedBrand.trim())?.brandId;


//   console.log("Selected Brand ID:", selectedBrandId); // Debugging log

//   if (selectedBrandId) {
//     reqData = `/getAllProductWarrantyByIdWithPage/${selectedBrandId}?page=${page + 1}&limit=${rowsPerPage}`;
//   }
// } 

// // If reqData is still empty, fall back to role-based API
// if (!reqData) {
//   reqData = user?.user?.role === "ADMIN"
//     ? `/getAllProductWarrantyWithPage?page=${page + 1}&limit=${rowsPerPage}`
//     : user?.user?.role === "BRAND EMPLOYEE"
//       ? `/getAllProductWarrantyByIdWithPage/${user?.user?.brandId}?page=${page + 1}&limit=${rowsPerPage}`
//       : `/getAllProductWarrantyByIdWithPage/${user?.user?._id}?page=${page + 1}&limit=${rowsPerPage}`;
// }

// console.log("Fetching data from:", reqData);  // Debugging log

//     try {
//       setLoading(true);
//       const response = await http_request.get(reqData);
//       const { data } = response;
//       const dataPP = data?.data?.map((item, index) => ({ ...item, i: index + 1 }));
//       setData(dataPP || []);
//       setTotalPages(data?.totalRecords || 0);
//     } catch (err) {
//       console.error("Error fetching warranty data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleSort = (property) => {
//     const isAsc = sortBy === property && sortDirection === "asc";
//     setSortDirection(isAsc ? "desc" : "asc");
//     setSortBy(property);
//   };

//   // Filter data based on selected brand
//   const uniqueBrands = [...new Set(brands?.map((item) => item.brandName))];


//   return (
//     <div>
//       <Toaster />
//       <div className="flex justify-between items-center mb-3">
//         <div className="font-bold text-2xl">Warranty Information</div>
//         <div className="flex space-x-4 ">
//           {/* Brand Filter Dropdown */}
//           <FormControl size="small" sx={{ width: "300px" }} variant="outlined">
//             <InputLabel>Filter by Brand</InputLabel>
//             <Select
//               value={selectedBrand}
//               onChange={(e) => {
//                 setSelectedBrand(e.target.value);
//                 setPage(0); // Reset to first page on brand change
//                 fetchProductWarranty(); // Fetch data with the new filter
//               }}
//               label="Filter by Brand"
//             >
//               <MenuItem value="">All Brands</MenuItem>
//               {uniqueBrands.map((brand) => (
//                 <MenuItem key={brand} value={brand}>
//                   {brand}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </div>
//         <div onClick={() => setEditModalOpen(true)} className="flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center">
//           <Add style={{ color: "white" }} />
//           <div className="ml-2">Add Warranty</div>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex-grow flex justify-center items-center">
//           <ReactLoader />
//         </div>
//       ) : (
//         <>
//           <TableContainer component={Paper} className="flex-grow">
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>ID</TableCell>
//                   <TableCell>Brand Name</TableCell>
//                   <TableCell>Product Name</TableCell>
//                   <TableCell>Number of QR</TableCell>
//                   <TableCell>Warranty Days</TableCell>
//                   <TableCell>Batch No.</TableCell>
//                   <TableCell>Created At</TableCell>
//                   <TableCell>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {data?.map((row) => (
//                   <TableRow key={row.i} hover>
//                     <TableCell>{row.i}</TableCell>
//                     <TableCell>{row.brandName}</TableCell>
//                     <TableCell>{row.productName}</TableCell>
//                     <TableCell>{row.numberOfGenerate}</TableCell>
//                     <TableCell>{row.warrantyInDays}</TableCell>
//                     <TableCell>{row?.records?.[0]?.batchNo}</TableCell>
//                     <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
//                     <TableCell className="flex">
//                       <IconButton aria-label="view" onClick={() => router.push(`/product/warranty/details/${row._id}`)}>
//                         <Visibility color="primary" />
//                       </IconButton>
//                       {user?.user?.role === "ADMIN" && (
//                         <IconButton aria-label="delete" onClick={() => setConfirmBoxView(true)}>
//                           <Delete color="error" />
//                         </IconButton>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25]}
//             component="div"
//             count={totalPages}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//           />
//         </>
//       )}

//       <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
//         <DialogTitle>{editData?._id ? "Edit Product Warranty" : "Add Product Warranty"}</DialogTitle>
//         <DialogContent>
//           <ProductWarrantyForm brand={props?.brand} product={props?.product} />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ProductWarrantyPage;


// Stable Sort and Comparator functions
function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis?.map((el) => el[0]);
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
