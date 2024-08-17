import React from 'react';
import { Add, Delete } from "@mui/icons-material";
import { Typography, Card, IconButton } from "@mui/material";

function Item({ item, actionFn, setFn, icon }) {

  return (
    <Card variant="outlined" sx={{ margin: "10px", padding: "0px 10px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <Typography component="div" variant="h6">
        {item.title}
      </Typography>
      <IconButton onClick={() => actionFn(item, setFn)}>{
        icon === "add" ? <Add color="primary" /> : <Delete color="warning" />
      }</IconButton>
    </Card>
  );
}

export default Item;
