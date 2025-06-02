// "use client";
// import React, { useEffect, useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import http_request from "../../../../../../http-request";
// import Sidenav from "@/app/components/Sidenav";
// import { ToastMessage } from "@/app/components/common/Toastify";
// import { useRouter } from "next/navigation";
// import Select from "react-select";
// import { useUser } from "@/app/components/UserContext";

// const Editemployee = ({ params }) => {
//     const {user}=useUser()
//     const router = useRouter();
//     const [id, setId] = useState("");
//     const [employee, setEmployee] = useState("");
//     const [loading, setLoading] = useState(false);

//     const [states, setStates] = useState([]);
//     const [brands, setBrands] = useState([]);
//     const { register, handleSubmit, control, formState: { errors }, setValue, watch } = useForm();

//     useEffect(() => {
//         getEmployeeById();
//         getAllBrand()
//     }, [id]);

//     useEffect(() => {
//         if (employee) {
//             setValue("name", employee.name);
//             setValue("email", employee.email);
//             setValue("contact", employee.contact);
//             setValue("password", employee.password);
//             setValue("salary", employee.salary);

//             // Fix: Store only the array of selected values, not objects
//             const formattedStateZone = employee.stateZone || [];
//             setValue("stateZone", formattedStateZone);
//             setValue("brand", employee.brand || []);
//         }
//     }, [employee, setValue]);



//     const getEmployeeById = async () => {
//         try {
//             let response = await http_request.get(`/getEmployeeBy/${params.id}`);
//             let { data } = response;
//             setEmployee(data);
//             setId(data?._id);
//         } catch (err) {
//             console.log(err);
//         }
//     };
//     const getAllBrand = async () => {
//         try {
//             let response = await http_request.get(`/getAllBrand`);
//             let { data } = response;
//             const brands2 = data.map((brand) => ({
//                 label: brand.brandName,  // this is what will be displayed in the dropdown
//                 value: brand._id,        // this is the internal value (e.g., for form submission)
//             }));
//             setBrands(brands2);

//         } catch (err) {
//             console.log(err);
//         }
//     };


//     const UpdateEmployee = async (reqdata) => {
//         try {
//             setLoading(true);
//             let response = await http_request.patch(`/editEmployee/${id}`, reqdata);
//             ToastMessage(response.data);
//             setLoading(false);
//             router.push("/user/employee");
//         } catch (err) {
//             setLoading(false);
//             ToastMessage(err.response.data);
//             console.log(err);
//         }
//     };

//     const onSubmit = (data) => {
//         UpdateEmployee(data);
//     };


//     useEffect(() => {
//         const loadFileFromPublic = async () => {
//             try {
//                 const response = await fetch("/INpostalCode.txt");
//                 if (!response.ok) throw new Error("Failed to fetch file");

//                 const text = await response.text();
//                 const lines = text.trim().split("\n");
//                 const uniqueStates = new Set();

//                 lines.forEach((line) => {
//                     const parts = line.split("\t").map((s) => s.trim());
//                     if (parts.length >= 4) { // Assuming state is in the 4th column
//                         uniqueStates.add(parts[3]);
//                     }
//                 });

//                 const stateOptions = [...uniqueStates].map((state) => ({
//                     label: state,
//                     value: state
//                 }));
//                 setStates(stateOptions);
//             } catch (error) {
//                 console.error("Error loading file:", error);
//             }
//         };

//         loadFileFromPublic();
//     }, []);



//     return (
//         <Sidenav>
//             <div className="h-screen flex justify-center items-center bg-gray-100 p-6">
//                 <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-8">
//                     <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
//                         Edit Employee
//                     </h2>

//                     <form className="grid md:grid-cols-2 gap-6" onSubmit={handleSubmit(onSubmit)}>
//                         {/* Name */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-900">Name</label>
//                             <input
//                                 type="text"
//                                 {...register("name", { required: "Name is required", minLength: 3 })}
//                                 className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
//                             />
//                             {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
//                         </div>

//                         {/* Email */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-900">Email</label>
//                             <input
//                                 type="email"
//                                 {...register("email", { required: "Email is required", pattern: /^\S+@\S+$/i })}
//                                 className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
//                             />
//                             {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
//                         </div>

//                         {/* Contact */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-900">Contact No.</label>
//                             <input
//                                 type="number"
//                                 {...register("contact", { required: "Contact number is required", pattern: /^\d{10}$/ })}
//                                 className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
//                             />
//                             {errors.contact && <p className="text-red-500 text-sm">{errors.contact.message}</p>}
//                         </div>

//                         {/* Password */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-900">Password</label>
//                             <input
//                                 type="text"
//                                 {...register("password", { required: "Password is required", minLength: 8 })}
//                                 className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
//                             />
//                             {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
//                         </div>
//                       {user?.user?.role==="ADMIN"?
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Salary
//                             </label>
//                             <input
//                                 type="number"
//                                 step="0.01"
//                                 {...register('salary', { required: 'Salary is required', min: 0 })}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                             {errors.salary && (
//                                 <p className="text-red-500 text-sm mt-1">{errors.salary.message}</p>
//                             )}
//                         </div>
//                         :""}
//                         {/* State Zones (Multi-Select) */}

//                         <div className="mb-4 w-full">
//                             <label className="block text-gray-700 font-medium mb-2">States:</label>
//                             <Controller
//                                 name="stateZone"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <Select
//                                         {...field}
//                                         options={states}
//                                         isMulti
//                                         className="basic-multi-select"
//                                         classNamePrefix="select"
//                                         getOptionLabel={(e) => e.label}
//                                         getOptionValue={(e) => e.value}
//                                         value={states.filter((s) => field.value?.includes(s.value))}
//                                         onChange={(selected) => {
//                                             const selectedValues = selected.map((s) => s.value);
//                                             field.onChange(selectedValues);
//                                             setValue("stateZone", selectedValues); // Sync with React Hook Form
//                                         }}
//                                     />
//                                 )}
//                             />

//                         </div>
//                         <div className="mb-4 w-full">
//                             <label className="block text-gray-700 font-medium mb-2">Brands:</label>
//                             <Controller
//                                 name="brand"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <Select
//                                         {...field}
//                                         isMulti
//                                         options={brands} // must be [{label, value}] format
//                                         className="basic-multi-select"
//                                         classNamePrefix="select"
//                                         getOptionLabel={(e) => e.label}
//                                         getOptionValue={(e) => e.value}
//                                         value={field.value || []} // now storing full object
//                                         onChange={(selectedOptions) => {
//                                             field.onChange(selectedOptions); // store full object in form state
//                                             setValue("brand", selectedOptions); // optional, keep synced with RHF

//                                         }}
//                                     />
//                                 )}
//                             />



//                         </div>




//                         {/* Submit Button */}
//                         <div className="col-span-2 flex justify-center">
//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="w-full max-w-xs px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
//                             >
//                                 {loading ? "Updating..." : "Update"}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </Sidenav>
//     );
// };

// export default Editemployee;

 "use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import http_request from "../../../../../../http-request";
import Sidenav from "@/app/components/Sidenav";
import { ToastMessage } from "@/app/components/common/Toastify";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { useUser } from "@/app/components/UserContext";

const Editemployee = ({ params }) => {
    const { user } = useUser();
    const router = useRouter();

    const [id, setId] = useState("");
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(false);

    const [states, setStates] = useState([]);
    const [brands, setBrands] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        watch,
    } = useForm();

    const selectedBrands = watch("brand") || [];
    const selectedProducts = watch("productModel") || [];

    // Fetch on mount
    useEffect(() => {
        GetAllProducts();
        GetAllCategories();
        getAllBrand();
        getEmployeeById();
    }, []);

    // Fetch Products
    const GetAllProducts = async () => {
        try {
            const res = await http_request.get("/getAllProduct");
            const { data } = res;
            setAllProducts(
                data.map((p) => ({
                    label: p.productName,
                    value: p._id,
                    brandId: p.brandId,
                    categoryId: p.categoryId,
                }))
            );
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch Categories
    const GetAllCategories = async () => {
        try {
            const res = await http_request.get("/getAllProductCategory");
            const { data } = res;
            setAllCategories(
                data.map((c) => ({
                    label: c.categoryName,
                    value: c._id,
                }))
            );
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch Brands
    const getAllBrand = async () => {
        try {
            const res = await http_request.get("/getAllBrand");
            const { data } = res;
            setBrands(
                data.map((b) => ({
                    label: b.brandName,
                    value: b._id,
                }))
            );
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch employee
    const getEmployeeById = async () => {
        try {
            const res = await http_request.get(`/getEmployeeBy/${params.id}`);
            const { data } = res;
            setEmployee(data);
            setId(data._id);
        } catch (err) {
            console.log(err);
        }
    };

    // Pre-fill form once employee is loaded
    useEffect(() => {
        if (employee) {
            setValue("name", employee.name);
            setValue("email", employee.email);
            setValue("contact", employee.contact);
            setValue("password", employee.password);
            setValue("salary", employee.salary);
            setValue("stateZone", employee.stateZone || []);
            setValue("brand", employee.brand || []);
            setValue("productModel", employee.productModel || []);
            setValue("productCategory", employee.productCategory || []);
            setValue("teamName", employee.teamName || "");
        }
    }, [employee]);

    // Filter products based on selected brands
    useEffect(() => {
        const brandIds = selectedBrands.map((b) => b.value);
        const filtered = allProducts.filter((p) => brandIds.includes(p.brandId));
        setFilteredProducts(filtered);
    }, [selectedBrands, allProducts]);

    // Filter categories based on selected products
    useEffect(() => {
        const selectedCategoryIds = new Set(
            selectedProducts.map((p) => p.categoryId).filter(Boolean)
        );
        const filtered = allCategories.filter((cat) =>
            selectedCategoryIds.has(cat.value)
        );
        setFilteredCategories(filtered);
        // setValue("productCategory", []);
    }, [selectedProducts]);

    const UpdateEmployee = async (data) => {
        try {
            setLoading(true);
            const res = await http_request.patch(`/editEmployee/${id}`, data);
            ToastMessage(res.data);
            setLoading(false);
            router.push("/user/employee");
        } catch (err) {
            setLoading(false);
            ToastMessage(err?.response?.data || "Update failed");
            console.error(err);
        }
    };

    useEffect(() => {
        const loadStates = async () => {
            try {
                const res = await fetch("/INpostalCode.txt");
                const text = await res.text();
                const lines = text.trim().split("\n");
                const uniqueStates = new Set();
                lines.forEach((line) => {
                    const parts = line.split("\t").map((s) => s.trim());
                    if (parts.length >= 4) uniqueStates.add(parts[3]);
                });
                setStates([...uniqueStates].map((s) => ({ label: s, value: s })));
            } catch (err) {
                console.error("State load error:", err);
            }
        };
        loadStates();
    }, []);

    const onSubmit = (data) => {
        UpdateEmployee(data);
    };

    const teamNameOptions = [
        { label: "Support", value: "Support" },
        { label: "RT Management", value: "RT Management" },
        { label: "Maintenance", value: "Maintenance" },
        { label: "Sales", value: "Sales" },
    ];

    return (
        <Sidenav>
            <div className="min-h-screen flex justify-center bg-gray-100 p-6">
                <div className="w-full max-w-5xl bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                        Edit Employee
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block font-medium">Name</label>
                            <input
                                {...register("name", { required: "Name is required" })}
                                className="w-full p-3 border rounded-md"
                            />
                            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block font-medium">Email</label>
                            <input
                                {...register("email", { required: "Email is required" })}
                                className="w-full p-3 border rounded-md"
                            />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        </div>

                        {/* Contact */}
                        <div>
                            <label className="block font-medium">Contact</label>
                            <input
                                {...register("contact", { required: "Contact is required" })}
                                className="w-full p-3 border rounded-md"
                            />
                            {errors.contact && <p className="text-red-500">{errors.contact.message}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block font-medium">Password</label>
                            <input
                                {...register("password", { required: "Password is required" })}
                                className="w-full p-3 border rounded-md"
                            />
                            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                        </div>

                        {/* Salary */}
                        {user?.user?.role === "ADMIN" && (
                            <div>
                                <label className="block font-medium">Salary</label>
                                <input
                                    type="number"
                                    {...register("salary", { required: "Salary is required" })}
                                    className="w-full p-3 border rounded-md"
                                />
                                {errors.salary && <p className="text-red-500">{errors.salary.message}</p>}
                            </div>
                        )}

                        {/* Team Name */}
                        <div>
                            <label className="block font-medium">Team Name</label>
                            <Controller
                                control={control}
                                name="teamName"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={teamNameOptions}
                                        value={teamNameOptions.find((option) => option.value === field.value)}
                                        onChange={(selected) => field.onChange(selected?.value)}
                                    />
                                )}
                            />
                        </div>

                        {/* States */}
                        <div>
                            <label className="block font-medium">States</label>
                            <Controller
                                control={control}
                                name="stateZone"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={states}
                                        isMulti
                                        value={states.filter((s) => field.value?.includes(s.value))}
                                        onChange={(val) => {
                                            const selected = val.map((v) => v.value);
                                            field.onChange(selected);
                                        }}
                                    />
                                )}
                            />
                        </div>

                        {/* Brands */}
                        <div>
                            <label className="block font-medium">Brands</label>
                            <Controller
                                control={control}
                                name="brand"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={brands}
                                        isMulti
                                        value={field.value}
                                        onChange={(val) => field.onChange(val)}
                                    />
                                )}
                            />
                        </div>

                        {/* Product Models */}
                        <div>
                            <label className="block font-medium">Products</label>
                            <Controller
                                name="productModel"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={filteredProducts}
                                        isMulti
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                        {/* Product Categories */}
                        <div>
                            <label className="block font-medium">Categories</label>
                            <Controller
                                control={control}
                                name="productCategory"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={filteredCategories}
                                        isMulti
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                        {/* Submit */}
                        <div className="col-span-2 text-center">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                {loading ? "Updating..." : "Update Employee"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Sidenav>
    );
};

export default Editemployee;
