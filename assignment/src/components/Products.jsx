import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import SampleImage from "../assets/Sample-image.jpeg";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [productsList, setProductsList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("None");

  const navigate = useNavigate();
  const debouneRef = useRef(null);

  const columns = [
    {
      field: "img",
      headerName: "Image",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <img
          src={params.row.img}
          alt={params.row.name}
          style={{
            height: "100%",
            width: "100%",
            objectFit: "contain",
          }}
        />
      ),
    },
    { field: "id", headerName: "id", width: 170, sortable: false, filterable: false},
    { field: "name", headerName: "Name", width: 450, sortable: false, filterable: false},
    { field: "main_category", headerName: "Category", width: 170, sortable: false, filterable: false},
    { field: "mrp", headerName: "Price", width: 170, filterable: false },
    { field: "location", headerName: "Location", width: 170, sortable: false, filterable: false},
    {
      field: "details",
      headerName: "Product Details",
      width: 170,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            onClick={() =>
              navigate(`/details/${params.row.id}`, {
                state: { product: params.row },
              })
            }
          >
            View Details
          </Button>
        );
      },
    },
  ];

  const getAllProductsData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products?page=${
          page + 1
        }`
      );
      let data = response.data.products;
      setTotalRows(response.data.totalResults);

      let formattedData = data.map((product, index) => ({
        ...product,
        img: product.images.front ? product.images.front : SampleImage,
        id: product.id !== null ? product.id : `tempId${index}`,
        name: product.name,
        category: product.main_category,
        mrp: product.mrp.mrp,
        location: product.mrp.location,
      }));

      setProductsList(formattedData);
      setFilteredProducts(formattedData);

      let filterCategories = [
        "All",
        ...new Set(
          formattedData.map((item) => item.main_category.toUpperCase())
        ),
      ];
      setCategories(filterCategories);
    } catch (err) {
      console.log("Something went wrong:", err);
    }
    setLoading(false);
  };

  const debounce = (func, delay) => {
    return (...args) => {
      if (debouneRef.current) {
        clearTimeout(debouneRef.current);
      }
      debouneRef.current = setTimeout(() => {
        func(...args);
      }, [delay]);
    };
  };

  const filterProductsBySearchAndCategory = (searchQuery, category, sortOrder) => {
    let filtered = [...productsList];

    if (category !== "ALL") {
      filtered = filtered.filter(
        (product) => product.category.toUpperCase() === category
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if(sortOrder === "asc"){
      filtered = [...filtered].sort((a,b)=>a.mrp - b.mrp)
    }else if (sortOrder === "desc"){
      filtered = [...filtered].sort((a,b)=> b.mrp - a.mrp);
    }

    setFilteredProducts(filtered);
  };

  const debouncedFilter = debounce(filterProductsBySearchAndCategory, 500);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategories(category);
    filterProductsBySearchAndCategory(searchInput, category.toUpperCase(), sortOrder);
  };

  const handleSearchInput = (e) => {
    const searchQuery = e.target.value;
    setSearchInput(searchQuery);
    debouncedFilter(searchQuery, selectedCategories.toUpperCase(), sortOrder);
  };

  const handleSortChange = (e)=>{
    const order = e.target.value;
    setSortOrder(order);
    filterProductsBySearchAndCategory(searchInput, selectedCategories.toUpperCase(), order);
  }

  useEffect(() => {
    getAllProductsData();
  }, [page]);

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <Box sx={{ display: { xs: "block", md: "flex" }, gap:2, mb:2 }}>
        <TextField
          variant="outlined"
          label="Search"
          value={searchInput}
          onChange={handleSearchInput}
          sx={{ minWidth: {xs: "100%", md:300}}}
        />

        <FormControl sx={{ minWidth: { xs: "100%", md: 200 }, mb:{xs:2} }} variant="standard">
          <InputLabel id="filter-by-category">Filter</InputLabel>
          <Select value={selectedCategories} onChange={handleCategoryChange} labelId="filter-by-category">
            {categories.map((category, idx) => (
              <MenuItem key={idx} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: { xs: "100%", md: 200 }, mb:{xs:2} }} variant="standard">
          <InputLabel id="sort-by-price">Sort By Price</InputLabel>
          <Select value={sortOrder} onChange={handleSortChange} labelId="sort-by-price">
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="asc">Low to High</MenuItem>
            <MenuItem value="desc">High to Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <DataGrid
        columns={columns}
        rows={filteredProducts}
        getRowId={(row) => row.id}
        paginationMode="server"
        rowCount={totalRows}
        pageSizeOptions={[20]}
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={(params) => {
          setPage(params.page);
          setPageSize(params.pageSize);
        }}
        loading={loading}
      />
    </Box>
  );
};

export default Products;
