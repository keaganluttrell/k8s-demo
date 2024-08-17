import React from 'react';
import Item from "./item";
import { Grid, Typography, Paper } from "@mui/material"

function List({ title, itemActionFn, list, setFn, col, color, icon }) {

  return (
    <Grid item container display="flex" direction="column" xs={4} gridColumn={col}>
      <Paper variant="outlined" sx={{padding: "20px", backgroundColor: color}}>
        <Typography component="div" variant="h5" textAlign="center">{title}</Typography>
        {list.map((item) => {
          return <Item key={item.id} item={item} actionFn={itemActionFn} setFn={setFn} icon={icon} />;
        })}
      </Paper>
    </Grid>
  );
}

export default List;
