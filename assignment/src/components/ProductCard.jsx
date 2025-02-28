import React from "react";
import Styles from "./ProductCard.module.css";
import { Box, Typography } from "@mui/material";

const ProductCard = ({id, name, category, mrp, location}) => {
  return (
    <Box className={Styles.wrapper}>
      <Typography>ID: {id}</Typography>
      <Typography>Name: {name}</Typography>
      <Typography>Category: {category}</Typography>
      <Typography className={Styles.mrp}>MRP: ₹{mrp}</Typography>
      <Typography>Location: {location}</Typography>
    </Box>
  );
};

export default ProductCard;
