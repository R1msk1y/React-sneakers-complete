import "../src/styles/main.scss";
import { Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "macro-css";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import AppContext from "./context";
import axios from "axios";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";

function App() {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [itemsResponse, cartResponse, favoritesResponse] =
          await Promise.all([
            axios.get("https://64a92ab28b9afaf4844a55dd.mockapi.io/items"),
            axios.get("https://64a92ab28b9afaf4844a55dd.mockapi.io/cart"),
            axios.get("https://63eb5803f1a969340db5fcc4.mockapi.io/favorites"),
          ]);
        setIsLoading(false);
        setCartItems(cartResponse.data);
        setFavorites(favoritesResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        alert("Ошибка при запросе данных ;(");
        console.error(error);
      }
    }

    fetchData();
  }, []);
  const onAddToCart = (obj) => {
    if (cartItems.find((item) => Number(item.id) === Number(obj.id))) {
      axios.delete(
        `https://64a92ab28b9afaf4844a55dd.mockapi.io/cart/${obj.id}`
      );
      setCartItems((prev) =>
        prev.filter((item) => Number(item.id) !== Number(obj.id))
      );
    } else {
      axios.post("https://64a92ab28b9afaf4844a55dd.mockapi.io/cart", obj);
      setCartItems((prev) => [...prev, obj]);
    }
  };
  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => favObj.id === obj.id)) {
        axios.delete(
          `https://63eb5803f1a969340db5fcc4.mockapi.io/favorites/${obj.id}`
        );
        setFavorites((prev) => prev.filter((item) => item.id !== obj.id));
      } else {
        const { data } = await axios.post(
          "https://63eb5803f1a969340db5fcc4.mockapi.io/favorites",
          obj
        );
        setFavorites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert("Не удалось доавить в фавориты");
    }
  };
  const onRemoveItem = (id) => {
    axios.delete(`https://64a92ab28b9afaf4844a55dd.mockapi.io/cart/${id}`);
    //все дай, кроме того у которого совпадет id
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };
  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };
  const [cartOpened, setCartOpened] = React.useState(false);
  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.id) === Number(id));
  };
  return (
    <AppContext.Provider
      value={{
        items,
        cartItems,
        favorites,
        isItemAdded,
        onAddToFavorite,
        setCartOpened,
        setCartItems,
      }}
    >
      <div className="wrapper">
        {cartOpened ? (
          <Drawer
            onRemove={onRemoveItem}
            items={cartItems}
            onClose={() => {
              setCartOpened(false);
            }}
          />
        ) : null}
        <Header
          onClickCart={() => {
            setCartOpened(true);
          }}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                items={items}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                onAddToFavorite={onAddToFavorite}
                onAddToCart={onAddToCart}
                cartItems={cartItems}
                isLoading={isLoading}
              />
            }
          />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
