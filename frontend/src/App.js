import React from 'react';
import List from "./components/list";
import * as api from "./functions";
import { useEffect, useState } from "react";
import { CssBaseline, Grid, Typography, Card } from "@mui/material";


function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.getUser(1, setUser);
    api.getProducts(setProducts);
    api.getCart(setCart);
  }, []);

  if (user) {
    return (
      <>
        <CssBaseline />
        <Grid
          display="flex"
          direction="column"
          justifyContent="center"
          alignItems="center"
          container
        >
          <Card variant="outlined" sx={{ backgroundColor: "#c7e9fc", margin: "10px" }}>
            <Typography component="div" variant="h5" textAlign="center" sx={{ margin: "20px" }}>Hello <em>{user.username}</em> from frontend</Typography>
          </Card>
          <Grid
            item
            container
            directon="row"
            justifyContent="center"
            spacing={2}
            columns={2}
            columnGap={2}
          >
            <List
              title="Products"
              itemActionFn={api.addItemToCart}
              list={products}
              setFn={setCart}
              col={1}
              color="#fcc7c7"
              icon="add"
            />
            <List
              title="Cart"
              itemActionFn={api.removeItemFromCart}
              list={cart}
              setFn={setCart}
              col={2}
              color="#c7fcd3"
              icon="delete"
            />
          </Grid>
        </Grid>
      </>
    );
  } else {
    return <div>Loading..</div>;
  }
}

export default App;
