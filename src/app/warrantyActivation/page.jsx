"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import http_request from '../../../http-request';
import { useForm } from 'react-hook-form';
import { ToastMessage } from '../components/common/Toastify';
import { Toaster } from 'react-hot-toast';

import axios from 'axios';
import { LocationCity, MyLocation } from '@mui/icons-material';
import { ReactLoader } from '../components/common/Loading';

const ActivateWarrantyButton = () => {
  const [activationStatus, setActivationStatus] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [warrantyDetails, setWarrantyDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [read, setRead] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [query, setQuery] = useState('');
  const [contactNo, setContactNo] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [product, setProduct] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [productID, setProductID] = useState("")
  const [users, setUsers] = useState(null);

  const [location, setLocation] = useState(null);
  const [jsonData, setJsonData] = useState([]);
  const [error, setError] = useState('');
  // const [pincode, setPincode] = useState('');
  // Set up react-hook-form
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    mode: 'onBlur', // or 'onChange' for real-time validation
  });
  useEffect(() => {
    const qrCode = searchParams.get('uniqueId');
    if (qrCode) {
      setQrCodeUrl(qrCode);
      getwarrantyDetails(qrCode);
      getAllProduct()// Call only once after setting the QR code
      getAllSubCategories()
    }
  }, [searchParams, refresh]);


  const getUserById = async (id) => {
    try {

      const response = await http_request.get(`/getBrandBy/${id}`);
      const { data } = response;
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  };

  const getwarrantyDetails = async (qrCode) => {
    try {
      setLoading(true);
      // console.log("qrCode", qrCode);

      const response = await http_request.get(`/getProductWarrantyByUniqueId/${qrCode}`);
      const { data } = response;
      setWarrantyDetails(data);
      getUserById(data?.brandId)
      setLoading(false);
    } catch (err) {
      console.error("Error fetching warranty details:", err);
      setLoading(false);
    }
  };
  const filterWarranty = warrantyDetails?.records?.find((f) => f?.uniqueId === qrCodeUrl)

  // console.log("filterWarranty", filterWarranty);
  // console.log("warrantyDetails",warrantyDetails);


  const calculateWarrantyExpiration = () => {
    if (warrantyDetails) {
      const purchaseDate = new Date(filterWarranty?.activationDate);
      const expirationDate = new Date(purchaseDate);
      expirationDate.setDate(purchaseDate.getDate() + filterWarranty?.warrantyInDays);
      return expirationDate.toLocaleDateString();
    }
    return null;
  };

  const calculateWarrantyDaysRemaining = () => {
    if (warrantyDetails) {
      const purchaseDate = new Date(warrantyDetails.year);
      const expirationDate = new Date(purchaseDate);
      expirationDate.setDate(purchaseDate.getDate() + warrantyDetails.warrantyInDays);

      const today = new Date();
      const timeDiff = expirationDate - today;
      const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

      return daysRemaining >= 0 ? daysRemaining : 0;
    }
    return null;
  };

  // const onSubmit = async (data) => {
  //   // console.log(data);
  //   try {
  //     if (!productID) {
  //       alert("Please select a product model");
  //       return;
  //     }
  //     if (!location) {
  //       alert("Please enter valid pincode!");
  //       return;
  //     }
  //     setLoading(true)
  //     const response = await http_request.post('/activateWarranty', {
  //       uniqueId: qrCodeUrl,
  //       ...data,
  //     });

  //     const result = response.data;

  //     if (result.status) {
  //       ToastMessage(result)
  //       setRefresh(result)
  //       // setLoading(false)
  //     } else {

  //       setRefresh(result)
  //       ToastMessage(result)
  //       setLoading(false)
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false)
  //     ToastMessage(error?.response?.data)

  //   }
  // };


  // const getLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         setValue("lat", latitude);
  //         setValue("long", longitude);
  //         if(latitude && longitude){
  //         handleSearchByLatLng(latitude,longitude)

  //         // Fetch address and pincode using a reverse geocoding API
  //         fetch(
  //           `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyC_L9VzjnWL4ent9VzCRAabM52RCcJJd2k`
  //         )
  //           .then((response) => response.json())
  //           .then((data) => {
  //             if (data.results && data.results.length > 0) {
  //               const bestMatch = data.results[0]; // The first result is usually the best match

  //               // Extract postal code (pincode)
  //               const postalCode = bestMatch.address_components.find((component) =>
  //                 component.types.includes("postal_code")
  //               );
  //               setValue("address", bestMatch.formatted_address);
  //               console.log("postalCode",postalCode?.long_name);
  //               setValue("pincode", postalCode ? postalCode?.long_name : "Pincode not found");

  //               // Extract district (administrative_area_level_2), fallback to locality or sublocality
  //               const districtComponent = bestMatch.address_components.find((component) =>
  //                 component.types.includes("administrative_area_level_2")
  //               );
  //               setValue("district", districtComponent ? districtComponent.long_name : "District not found");

  //               // Extract state (administrative_area_level_1)
  //               const stateComponent = bestMatch.address_components.find((component) =>
  //                 component.types.includes("administrative_area_level_1")
  //               );
  //               setValue("state", stateComponent ? stateComponent.long_name : "State not found");
  //             } else {
  //               console.warn("No results found for the given coordinates.");
  //             }

  //           })

  //           .catch((error) => {
  //             console.error("Error fetching address: ", error);
  //           });
  //         }
  //       },

  //       (error) => {
  //         console.error("Error getting location: ", error);
  //       },
  //       { enableHighAccuracy: true }

  //     );

  //   } else {
  //     alert("Geolocation is not supported by this browser.");
  //   }
  // };




  // const handleSearch = async () => {
  //   const apiKey = 'AIzaSyC_L9VzjnWL4ent9VzCRAabM52RCcJJd2k';
  //   const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;

  //   try {
  //     const response = await axios.get(url);
  //     const result = response.data.results[0];

  //     if (result) {
  //       // Extract latitude and longitude
  //       const { lat, lng } = result.geometry.location;
  //       setValue("lat", lat);
  //       setValue("long", lng);

  //       // Extract formatted address
  //       setValue("address", result.formatted_address);

  //       // Extract postal code (pincode)
  //       const postalCode = result.address_components.find(component =>
  //         component.types.includes('postal_code')
  //       );
  //       console.log("postalCode",postalCode,result);

  //       setValue("pincode", postalCode ? postalCode.long_name : "Pincode not found");

  //       // Extract district (administrative_area_level_2)
  //       const districtComponent = result.address_components.find(component =>
  //         component.types.includes('administrative_area_level_2') ||
  //         component.types.includes('locality') ||
  //         component.types.includes('sublocality')
  //       );
  //       setValue("district", districtComponent ? districtComponent.long_name : " ");
  //       // console.log(districtComponent ? districtComponent.long_name : " ");

  //       // Extract state (administrative_area_level_1)
  //       const stateComponent = result.address_components.find(component =>
  //         component.types.includes('administrative_area_level_1')
  //       );
  //       setValue("state", stateComponent ? stateComponent.long_name : " ");
  //       // console.log(stateComponent ? stateComponent.long_name : " ");


  //     } else {
  //       alert('Location not found');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching location: ', error);
  //   }
  // };




  // console.log(filterWarranty);
  const onSubmit = async (data) => {
    try {
      if (!productID) {
        alert("Please select a product model");
        return;
      }
      if (!location) {
        alert("Please enter valid pincode!");
        return;
      }

      setLoading(true);

      // Build FormData for image + other fields
      const formData = new FormData();
      formData.append("uniqueId", qrCodeUrl);

      // Append all other text fields
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      // Append image (if selected in file input)
      if (data.warrantyImage && data.warrantyImage[0]) {
        formData.append("warrantyImage", data.warrantyImage[0]); // file
      }

      const response = await http_request.post("/activateWarrantyWithImage", formData
      );

      const result = response.data;

      if (result.status) {
        ToastMessage(result);
        setRefresh(result);
      } else {
        setRefresh(result);
        ToastMessage(result);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      ToastMessage(error?.response?.data);
    }
  };

  const getLocation = (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          if (latitude && longitude) {
            console.log("Latitude:", latitude, "Longitude:", longitude);
            handleSearchByLatLng(latitude, longitude)
            // Set latitude and longitude values
            setValue("lat", latitude);
            setValue("long", longitude);

            try {
              // Fetch address and pincode using Google Geocoding API
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyC_L9VzjnWL4ent9VzCRAabM52RCcJJd2k`
              );
              const data = await response.json();

              if (data.results && data.results.length > 0) {
                const bestMatch = data.results[0]; // The first result is the most accurate

                // Set formatted address
                setValue("address", bestMatch.formatted_address);

                // Extract postal code (pincode)
                const postalCodeComponent = bestMatch.address_components.find((component) =>
                  component.types.includes("postal_code")
                );

                if (postalCodeComponent) {
                  const postalCode = postalCodeComponent.long_name;
                  // setValue("pincode", postalCode);
                  // console.log("Pincode:", postalCode);
                } else {
                  console.warn("Pincode not found in address components.", bestMatch.address_components);
                  // setValue("pincode", "");
                }

                // Extract district
                const districtComponent = bestMatch.address_components.find((component) =>
                  component.types.includes("administrative_area_level_2")
                );
                setValue("district", districtComponent ? districtComponent.long_name : "District not found");

                // Extract state
                const stateComponent = bestMatch.address_components.find((component) =>
                  component.types.includes("administrative_area_level_1")
                );
                setValue("state", stateComponent ? stateComponent.long_name : "State not found");
              } else {
                console.warn("No results found for the given coordinates.");
                setValue("address", "Address not found");
                setValue("pincode", "");
                setValue("district", "District not found");
                setValue("state", "State not found");
              }
            } catch (error) {
              console.error("Error fetching address: ", error);
              alert("Failed to fetch location details. Please try again.");
            }
          } else {
            console.warn("Latitude and longitude are not available.");
            alert("Unable to retrieve location details. Please try again.");
          }
        },
        (error) => {
          console.error("Error getting location: ", error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert("Location access denied by the user.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              alert("The request to get user location timed out.");
              break;
            default:
              alert("An unknown error occurred while fetching location.");
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Optional configurations
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  const pincode = watch('pincode');

  useEffect(() => {
    if (pincode?.length === 6) { // Ensure the pincode is valid (assuming 6 digits)
      fetchLocation(pincode);
      setValue('pincode', pincode)
    }
  }, [pincode]);


  useEffect(() => {
    // Fetch the file from the public folder
    const loadFileFromPublic = async () => {
      try {
        const response = await fetch("/INpostalCode.txt");
        // console.log("response",response);
        // Adjust filename if needed
        const text = await response.text();  // Read file content as text

        const lines = text.trim().split("\n");
        const stateData = {};

        lines.forEach((line) => {
          const parts = line.split("\t").map((s) => s.trim());

          if (parts.length >= 5) {
            const pincode = parts[1]; // Pincode
            const areaName = parts[2]; // Area
            const state = parts[3]; // State
            const district = parts[5]; // District

            if (!stateData[state]) {
              stateData[state] = {};
            }
            if (!stateData[state][district]) {
              stateData[state][district] = [];
            }

            stateData[state][district].push({ areaName, pincode });
          }
        });
        // console.log("stateData",stateData);

        setJsonData(stateData);
      } catch (error) {
        console.error("Error loading file:", error);
      }
    };

    loadFileFromPublic();
  }, []);


  const fetchLocation = async (pincode) => {
    try {
      // console.log("pincode", pincode);

      if (!pincode || pincode.toString().trim().length !== 6) {
        setError('Please enter a valid 6-digit pincode.');
        return null;
      }

      const pinStr = pincode.toString().trim();

      // Step 1: Check local file data
      if (jsonData && Object.keys(jsonData).length > 0) {
        for (const state in jsonData) {
          for (const district in jsonData[state]) {
            const match = jsonData[state][district].find(
              (entry) => entry.pincode.toString() === pinStr
            );

            if (match) {
              // console.log(" District: district, State: state ",   district,   state );

              console.log("✅ Local match found:", match, district, state);
              setLocation({ District: district, State: state });
              setValue('pincode', pinStr);
              setValue('state', state);
              setValue('district', district);
              setError('');
              return { District: district, State: state, Area: match.areaName };
            }
          }
        }
      }
      setError('No location found for the provided pincode.');
      setError('No location found for the provided pincode.');
      setLocation(null);
      setValue('pincode', '');
      setValue('state', '');
      setValue('district', '');

      // Step 2: Fallback to external API
      // const response = await axios.get(`https://api.postalpincode.in/pincode/${pinStr}`);
      // if (response.data && response.data[0].Status === 'Success') {
      //   const { PostOffice } = response.data[0];
      //   const { District, State } = PostOffice[0];

      //   console.log("✅ API match found:", District, State);
      //   setLocation({ District, State });
      //   setValue('pincode', pinStr);
      //   setValue('state', State);
      //   setValue('district', District);
      //   setError('');
      //   return PostOffice[0];
      // } else {
      //   setError('No location found for the provided pincode.');
      //   return null;
      // }

    } catch (error) {
      console.error("❌ Error fetching location:", error);
      setError('Something went wrong while fetching location.');
      return null;
    }
  };

  const handleSearch = async () => {
    const apiKey = 'AIzaSyC_L9VzjnWL4ent9VzCRAabM52RCcJJd2k';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const result = response.data.results[0];

      if (result) {
        // Log the full response for debugging
        console.log("Geocode Result:", result);

        // Extract latitude and longitude
        const { lat, lng } = result.geometry.location;
        setValue("lat", lat);
        setValue("long", lng);
        handleSearchByLatLng(lat, lng)
        // Extract formatted address
        console.log(result.formatted_address);

        setValue("address", result.formatted_address);

        // Extract postal code (pincode)
        // const postalCodeComponent = result.address_components.find(component =>
        //   component.types.includes('postal_code')
        // );
        // if (postalCodeComponent) {
        //   setValue("pincode", postalCodeComponent.long_name);
        //   console.log("Pincode:", postalCodeComponent.long_name);
        // } else {
        //   setValue("pincode", "Pincode not found");
        //   console.warn("Pincode not found in the address components.");
        // }

        // Extract district
        const districtComponent = result.address_components.find(component =>
          component.types.includes('administrative_area_level_2') ||
          component.types.includes('locality') ||
          component.types.includes('sublocality')
        );
        console.log(districtComponent.long_name);

        setValue("district", districtComponent ? districtComponent.long_name : "District not found");

        // Extract state
        const stateComponent = result.address_components.find(component =>
          component.types.includes('administrative_area_level_1')
        );
        console.log(stateComponent.long_name);

        setValue("state", stateComponent ? stateComponent.long_name : "State not found");
      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  const handleSearchByLatLng = async (lat, lng) => {
    const apiKey = 'AIzaSyC_L9VzjnWL4ent9VzCRAabM52RCcJJd2k';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {

      const response = await axios.get(url);
      const result = response.data.results[0];

      if (result) {
        console.log("Geocode Response:", response.data);

        // Extract postal code (pincode)
        const postalCodeComponent = result.address_components.find(component =>
          component.types.includes('postal_code')
        );

        if (postalCodeComponent) {
          setValue("pincode", postalCodeComponent.long_name);
          // setPincode(postalCodeComponent?.long_name)
          // setPincode(postalCodeComponent.long_name)
          console.log("Pincode:", postalCodeComponent.long_name);
        } else {
          console.warn("Pincode not found in the address components.");
          setValue("pincode", "");
        }

        // Set other address details if needed
        // setValue("address", result.formatted_address);
      } else {
        alert('Location details not found');
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
    }
  };

  // useEffect(() => {
  //   if (product && filterWarranty) {
  //     const selectedProduct = product.find((f) => f?._id === filterWarranty?.productId);

  //     if (selectedProduct) {
  //       setValue('productId', selectedProduct._id);
  //       setValue('productName', selectedProduct.productName);
  //       // setValue('brandName', selectedProduct.productBrand);
  //       // setValue('brandId', selectedProduct.brandId);
  //       setValue('categoryId', selectedProduct.categoryId);
  //       setValue('subCategoryId', selectedProduct.subCategoryId);
  //       setValue('categoryName', selectedProduct.categoryName);
  //       setValue('year', new Date());
  //       setProductID(selectedProduct._id)
  //     }
  //   }
  // }, [product, filterWarranty, setValue]);

  useEffect(() => {
    if (product && filterWarranty) {
      const selectedProduct = product.find((f) => f?._id === filterWarranty?.productId);

      if (selectedProduct) {
        setValue('productId', selectedProduct._id);
        setValue('productName', selectedProduct.productName);
        setValue('categoryId', selectedProduct.categoryId);
        setValue('subCategoryId', selectedProduct.subCategoryId);
        setValue('categoryName', selectedProduct.categoryName);
        setValue('year', new Date());
        setProductID(selectedProduct._id)
      }
    }
  }, [product, filterWarranty, setValue]);


  const getAllProduct = async () => {
    try {
      setLoading(true); // start loading
      const response = await http_request.get("/getAllProduct");
      setProduct(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // stop loading
    }
  };

  const getAllSubCategories = async () => {
    try {
      setLoading(true); // start loading
      const response = await http_request.get("/getAllSubCategory"); // fixed endpoint
      setSubCategories(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // stop loading
    }
  };
  // console.log("gdhhsgh", filterWarranty);

  const filterProduct = product?.find((f) => f?._id === filterWarranty?.productId)

  // Step 1: Find the main subCategory from filterWarranty
  const mainSubCat = subCategories.find(sc => sc?._id === filterWarranty?.subCategoryId);

  // console.log("mainSubCat", mainSubCat);

  if (!mainSubCat) {
    console.log("SubCategory not found!");
    // return;
  }

  // Step 2: Find all subCategories with the same stickerPrice
  // const matchingSubCatIds = 
  // subCategories
  //   .filter(sc => sc?.stickerPrice === mainSubCat?.stickerPrice)
  //   .map(sc => sc?._id);

  let matchingSubCatIds = [];

  const filteredSubs = subCategories?.filter(
    (sc) => sc?.stickerPrice === mainSubCat?.stickerPrice
  );

  if (filterWarranty?.brandId === "68a2fec108ab22c128f63b9f") {
    matchingSubCatIds = filteredSubs.map((sc) => ({
      _id: sc?._id,
      subCategoryName: sc?.subCategoryName,
    }));
  } else {
    matchingSubCatIds = filteredSubs.map((sc) => sc?._id);
  }

  // console.log("Matching subCategory IDs:", matchingSubCatIds);



  // console.log("Filtered Products:", filteredProducts1);

  // console.log("filterProduct",filterProduct);
  //   const filterProductByBrand = filterWarranty?.brandId === "68a2fec108ab22c128f63b9f" ? product.filter(p => {
  //   if (p.brandId !== filterWarranty.brandId) return false;
  //   if (!matchingSubCatIds.includes(p.subCategoryId)) return false;
  //   // return true;
  // }) : product?.filter((f) => f?.brandId === filterWarranty?.brandId)
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  // Handle select change
  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
  };
  const filterProductByBrand = product?.filter((p) => {
    // Brand must always match
    if (p.brandId !== filterWarranty?.brandId) return false;

    // Special case: if brandId is "68a2fec108ab22c128f63b9f", 
    // then filter by matchingSubCatIds as well
    if (filterWarranty?.brandId === "68a2fec108ab22c128f63b9f") {
      if (selectedSubCategory) {
        return p.subCategoryId === selectedSubCategory;
      }
      return matchingSubCatIds.includes(p.subCategoryId);
    }

    // Default case: allow product if brandId matches
    return true;
  });


  // const filterProductByBrand = product?.filter((f) => f?.subCategoryId === filterWarranty?.subCategoryId)
  // console.log(filterProductByBrand);


  const handleProductChange = (e) => {
    const selectedProductId = e.target.value;
    const selectedProduct = product?.find(prod => prod._id === selectedProductId);
    console.log(selectedProduct);

    if (selectedProduct) {
      setValue('productId', selectedProduct._id);
      setValue('productName', selectedProduct.productName);
      // setValue('brandName', selectedProduct.productBrand);
      // setValue('brandId', selectedProduct.brandId);
      setValue('categoryId', selectedProduct.categoryId);
      setValue('subCategoryId', selectedProduct.subCategoryId);
      setValue('categoryName', selectedProduct.categoryName);
      setValue('year', new Date());
      setProductID(selectedProduct._id)
    }
  };

  const handleComplaint = async () => {

    try {
      const reqdata = {
        brandId: filterWarranty?.brandId, productBrand: filterWarranty?.brandName, productId: filterProduct?._id, productName: filterProduct?.productName
        , categoryId: filterProduct?.categoryId, subCategoryId: filterProduct?.subCategoryId, categoryName: filterProduct?.categoryName, modelNo: filterProduct?.modelNo
        , serialNo: filterProduct?.serialNo, warrantyStatus: filterProduct?.warrantyStatus, uniqueId: qrCodeUrl
        , lat: filterWarranty?.lat, long: filterWarranty?.long, userId: filterWarranty?.userId
        , userName: filterWarranty?.userName, serviceLocation: filterWarranty?.address, fullName: filterWarranty?.userName,
        phoneNumber: filterWarranty?.contact, emailAddress: `${filterWarranty?.contact}@gmail.com`, pincode: filterWarranty?.pincode
        , state: filterWarranty?.state, district: filterWarranty?.district, serviceAddress: filterWarranty?.address

      }
      // console.log(reqdata);

      if (contactNo === filterWarranty?.contact) {
        setLoading(true)
        const formData = new FormData();

        for (const key in reqdata) {
          if (reqdata.hasOwnProperty(key)) {
            formData.append(key, reqdata[key]);
          }
        }
        const issueImages = "image";
        // console.log("dhhh",issueImages);
        if (issueImages) {
          formData.append('issueImages', issueImages);
        }
        let response = await http_request.post('/createComplaint', reqdata)
        const { data } = response
        // console.log(data);
        const userData = { user: data?.user }
        localStorage.setItem('user', JSON.stringify(userData));
        ToastMessage(data)
        setLoading(false)

        // router.push("/dashboard")
        // window.location.reload()
        window.location.href = "/dashboard"
      }
      else {
        alert("Fill proper contact number  and try  this QR code")
      }
    }

    catch (error) {
      console.log(error);
      ToastMessage(error?.response?.data)
      setLoading(false)
      //   setActivationStatus('Error activating warranty');
    }
  }

  const handleDashboard = async (id) => {
    try {
      // console.log(id);
      const response = await http_request.post("/dashboardLogin", { userId: id });
      let { data } = response;

      ToastMessage(data)
      localStorage.setItem('user', JSON.stringify(data));
      window.location.href = "/dashboard"
    } catch (error) {
      ToastMessage(error?.response?.data)
      console.log(error);

    }
  }

  // console.log("filterWarranty", filterWarranty)

  return (
    <>
      <Toaster />
      {loading === true || !filterWarranty ? <div>
        <ReactLoader />
      </div>
        : <div className="flex justify-center items-center min-h-screen bg-white p-5">
          <Toaster />
          <div className="bg-[#e5f2f8] p-8 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-center mb-3 ">
              <img
                src={users?._id === "687b60524784729ee719776e"
                  ? (users?.brandLogo || "/Logo.png")
                  : "/Logo.png"}


                alt="Servsy Logo"
                className="h-16 w-auto rounded-md" // Adjust size as needed
              />
            </div>
            <h2 className="text-2xl font-semibold text-center text-gray-800  ">Activate Your Product Warranty</h2>
            <div className="grid grid-cols-2 bg-white rounded-2xl py-4 ga p-4 mt-3">

              <div className='mt-2'>
                <label className="font-bold text-sm text-gray-700">Brand Name </label>
                <p className="text-gray-600" text-sm>{warrantyDetails.brandName}</p>
              </div>

              <div className='mt-2'>
                <label className="font-bold text-gray-700 text-sm">Product Name </label>
                <p className="text-gray-600 text-sm">{filterWarranty?.productName}</p>
              </div>

              <div className='mt-2'>
                <label className="font-bold text-gray-700 text-sm">Unique Code </label>
                <p className="text-gray-600 text-sm">{qrCodeUrl}</p>
              </div>
              <div className='mt-2'>
                <label className="font-bold text-gray-700 text-sm">Year</label>
                {filterWarranty?.activationDate && !isNaN(new Date(filterWarranty.activationDate)) ? (
                  <p className="text-gray-600 text-sm">
                    {new Date(filterWarranty.activationDate).toLocaleDateString()}
                  </p>
                ) : (
                  <p className="text-gray-600 text-sm">{new Date().getFullYear()}</p>
                )}
              </div>

              {/* <div>
          <label className="font-bold text-gray-700">Warranty Expiration Date:</label>
          <p className="text-gray-600">{calculateWarrantyExpiration()}</p>
        </div> */}

              <div className='mt-2'>
                <label className="font-bold text-gray-700 text-sm">Warranty Exp  </label>
                <p className="text-gray-600 text-sm">{filterWarranty?.isActivated === true ? calculateWarrantyExpiration() : " Not activated"}</p>
              </div>
              <div className='mt-2'>
                <label className="font-bold text-gray-700 text-sm">Activated </label>
                <p className="text-gray-600 text-sm">{filterWarranty?.isActivated === true ? "Yes" : "No"}  </p>
              </div>
            </div>
            {/* {filterWarranty?.isActivated === true ?
             
                <div>
                  <div className='mb-5 mt-5 '>
                    <label htmlFor="contact" className="block text-gray-700 ">Contact:</label>
                    <input
                      id="contact"
                      type="text"
                      value={contactNo}
                      onChange={(e) => setContactNo(e.target.value)}
                      placeholder='Please enter your register number'
                      className="w-full  p-0.5 border border-gray-300 rounded-md"
                    />
                    {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
                  </div>
                  <div className='flex justify-between '>

                    <div>
                      <button
                        onClick={() => handleDashboard(filterWarranty?.userId)}
                        className="w-full bg-green-500 text-white p-1 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                      >
                        Go Dashboard
                      </button>
                    </div>

                    <div>
                      <button
                        onClick={handleComplaint}
                        className="ms-2 w-full bg-blue-500 text-white p-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        Create Complaint
                      </button>
                    </div>
                  </div>
                </div>
               */}
            {filterWarranty?.isActivated ? (
              <>
                {filterWarranty?.status === "PENDING" ? (
                  // 🟡 Show pending card
                  <div className="flex items-start mt-5 gap-3 p-4 bg-yellow-50 border border-yellow-300 rounded-md text-yellow-700 shadow-sm">
                    <span className="text-xl">⏳</span>
                    <div>
                      <h3 className="font-semibold">Warranty Pending</h3>
                      <p className="text-sm">
                        Your warranty activation request has been submitted and is awaiting admin approval.
                        Please check back later.
                      </p>
                    </div>
                  </div>
                ) : filterWarranty?.status === "APPROVE" ? (
                  // 🟢 Approved → show dashboard/complaint actions
                  <div>
                    <div className="flex mt-5 items-start gap-3 p-4 bg-green-50 border border-green-300 rounded-md text-green-700 shadow-sm">
                      <span className="text-xl">✅</span>
                      <div>
                        <h3 className="font-semibold">Warranty Approved</h3>
                        <p className="text-sm">
                          Congratulations! Your warranty has been approved successfully.
                        </p>
                      </div>
                    </div>
                    <div className="mb-5 mt-5">
                      <label htmlFor="contact" className="block text-gray-700">Contact:</label>
                      <input
                        id="contact"
                        type="text"
                        value={contactNo}
                        onChange={(e) => setContactNo(e.target.value)}
                        placeholder="Please enter your registered number"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      />
                      {errors.contact && (
                        <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>
                      )}
                    </div>

                    <div className="flex justify-between gap-3">
                      <button
                        onClick={() => handleDashboard(filterWarranty?.userId)}
                        className="flex-1 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                      >
                        Go Dashboard
                      </button>

                      <button
                        onClick={handleComplaint}
                        className="flex-1 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      >
                        Create Complaint
                      </button>
                    </div>
                  </div>
                ) : filterWarranty?.status === "DISAPPROVE" ? (
                  // 🔴 Disapproved
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-300 rounded-md text-red-700 shadow-sm">
                    <span className="text-xl">❌</span>
                    <div>
                      <h3 className="font-semibold">Warranty Disapproved</h3>
                      <p className="text-sm">
                        Unfortunately, your warranty request has been rejected. Please contact support.
                      </p>
                    </div>
                  </div>
                ) : null}
              </>
            )
              :
              <div>
                {/* <h2 className="text-xl font-semibold mb-4 mt-5  text-gray-800">Activate Warranty</h2> */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                  {filterWarranty?.isActivated === false && !filterWarranty?.productId ?
                    <>
                      {filterWarranty?.brandId === "68a2fec108ab22c128f63b9f" ?
                        <div className="mt-5">
                          <label className="block text-sm font-medium text-gray-700">
                            Category
                          </label>
                          <select
                            id="category"
                            {...register("category", { required: "Please select a category" })}
                            onChange={handleSubCategoryChange}
                            defaultValue=""
                            className={`mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.category ? "border-red-500" : ""
                              }`}
                          >
                            <option value="" disabled>
                              Select a category
                            </option>
                            {matchingSubCatIds?.map((cat) => (
                              <option key={cat._id} value={cat._id}>
                                {cat.subCategoryName}
                              </option>
                            ))}
                          </select>
                        </div>
                        : ""
                      }
                      <div className='mt-5'>
                        <label className="block text-sm font-medium text-gray-700">
                          Product Name
                        </label>
                        <select
                          id="productName"
                          // {...register("productName", {
                          //   required: "Please select a product",
                          // })}
                          onChange={handleProductChange}
                          defaultValue=""
                          className={`mt-1 block w-full px-3 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.productName ? "border-red-500" : ""
                            }`}
                        >
                          <option value="" disabled>
                            Select a product
                          </option>
                          {filterProductByBrand?.map((prod) => (
                            <option key={prod._id} value={prod._id}>
                              {prod.productName}
                            </option>
                          ))}
                        </select>

                        {productID === "" &&
                          <p className="text-red-500 text-sm text-center mt-1">
                            {"Please Select Product Model"}
                          </p>
                        }
                      </div>
                    </>
                    : ""

                  }
                  <div className='mt-5'>
                    <label htmlFor="name" className="block text-gray-700">Full Name:</label>
                    <input
                      id="name"
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      className="w-full p-0.5 border border-gray-300 rounded-md"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact" className="block text-gray-700">Contact:</label>
                    <input
                      id="contact"
                      type="text"
                      {...register('contact', { required: 'Contact is required' })}
                      className="w-full  p-0.5 border border-gray-300 rounded-md"
                    />
                    {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
                  </div>
                  {/* <div>
                  <label htmlFor="email" className="block text-gray-700">Email:</label>
                  <input
                    id="email"
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email address',
                      },
                    })}
                    className="w-full  p-0.5 border border-gray-300 rounded-md"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div> */}
                  {/* <div>
                  <label htmlFor="password" className="block text-gray-700">Password:</label>
                  <input
                    id="password"
                    type="password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters long',
                      },
                    })}
                    className="w-full  p-0.5 border border-gray-300 rounded-md"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div> */}

                  <div className=''>
                    <label htmlFor="address" className="block text-gray-700">Full Address:</label>
                    <div className="flex w-full justify-between max-w-md space-x-3 ">

                      <input
                        id="address"
                        type="text"
                        // {...register('address', { required: 'Address is required' })}
                        {...register('address' )}
                        className=" w-full  p-0.5 border border-gray-300 rounded-md"
                      />


                      <button
                        onClick={(e) => getLocation(e)}
                        className="  bg-blue-500 text-white text-sm flex px-2 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        <MyLocation /> Location
                      </button>

                    </div>
                    {/* {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>} */}
                  </div>
                  <div>
                    <label htmlFor="pincode" className="block text-gray-700">Pincode:</label>
                    <input
                      id="pincode"
                      type="number"
                      // {...register('pincode', { required: 'Pincode is required' })}
                      {...register('pincode' )}
                      placeholder="Enter 6-digit pincode"
                      className="border p-1 rounded-md  w-full"
                      maxLength={6}
                    // className="w-full  p-0.5 border border-gray-300 rounded-md"
                    />
                    {/* {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>}
                    {error && <p className="text-red-500 mt-1">{error}</p>} */}
                  </div>
                  <div className="mt-5">
                    <label htmlFor="warrantyImage" className="block text-gray-700">
                      Warranty Image (Bill/Invoice/Certificate)
                    </label>
                    <input
                      id="warrantyImage"
                      type="file"
                      accept="image/*" // only images
                      // {...register("warrantyImage", {
                      //   required: "Warranty image is required",
                      // })}
                       {...register("warrantyImage" 
                        )}
                      className="w-full p-1 border border-gray-300 rounded-md file:mr-3 file:py-1 file:px-3 file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {/* {errors.warrantyImage && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.warrantyImage.message}
                      </p>
                    )} */}
                  </div>
                </form>

                <div className="flex w-full max-w-md mt-6 space-x-3">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter location"
                    className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    onClick={() => handleSearch()}
                    className="bg-blue-500 text-sm text-white px-6 py-1 rounded-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Search
                  </button>
                </div>
                <div className="mt-5">
                  <input
                    id="terms"
                    type="checkbox"
                    {...register('termsCondtions', { required: 'You must accept the terms and conditions' })}
                    className="mr-2"
                  />
                  <label htmlFor="terms" className="text-gray-700">
                    I agree to warranty{' '}
                    <button
                      type="button"
                      onClick={() => setRead(true)} // Handle showing terms
                      className="text-blue-500 underline hover:text-blue-700 focus:outline-none"
                    >
                      Terms and Conditions
                    </button>
                  </label>
                  {errors.termsCondtions && <p className="text-red-500 text-sm mt-1">{errors.termsCondtions.message}</p>}
                </div>
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={!qrCodeUrl}
                  className="w-full mt-5 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Activate Warranty
                </button>

                {activationStatus && <p className="mt-4 text-center text-green-500">{activationStatus}</p>}
              </div>
            }
          </div>


        </div>
      }
      {read === true ? <div className="m-10">
        <h2 className="text-xl font-semibold mb-2">Warranty Terms & Conditions</h2>
        <div
          className="p-4 border rounded bg-gray-50"
          dangerouslySetInnerHTML={{ __html: users?.warrantyCondition }}
        />
        <div className="flex justify-center mt-5">
          <button
            onClick={() => setRead(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
        : ""
      }
      {/* <Hero /> */}
    </>
  );
};

export default ActivateWarrantyButton;
