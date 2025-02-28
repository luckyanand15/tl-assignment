import { Box, Typography } from "@mui/material";
import React from "react";
import { useLocation, useParams } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import ProductCard from "./ProductCard";

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const product = location.state?.product;

  return (
    <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", height:"80vh"}}>
      <Grid container justifyContent={"center"} spacing={{ md: 2, xs: 1 }}>
        <Grid item size={{ md: 3, xs: 12 }}>
          <img src={product.img} height="100%" width="100%" />
        </Grid>
        <Grid item size={{ md: 3, xs: 12 }}>
          <ProductCard id={id} name={product.name} category={product.category} mrp={product.mrp} location={product.location}/>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetails;
