import Card from "../../src/components/Card";

import React from "react";
const Home = ({
  items,
  searchValue,
  setSearchValue,
  onChangeSearchInput,
  onAddToCart,
  onAddToFavorite,
  cartItems,
  isLoading,
}) => {
  const renderItems = () => {
    const filtredItems = items.filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    return (isLoading ? [...Array(8)] : filtredItems).map((item, index) => (
      <Card
        {...item}
        loading={isLoading}
        key={index}
        onFavorite={(obj) => {
          onAddToFavorite(obj);
        }}
        onPlus={(obj) => {
          onAddToCart(obj);
        }}
      />
    ));
  };
  return (
    <div className="content p-40">
      <div className="content-flex d-flex align-center justify-between mb-40">
        <h1>Все кроссовки</h1>
        <div className="search-block d-flex">
          <img src="/img/icons/find.svg" alt="Search" />
          {searchValue && (
            <img
              onClick={() => {
                setSearchValue("");
              }}
              className=" clear cu-p removeBtn"
              src="/img/icons/btn_remove.svg"
              alt="btn_remove"
            />
          )}

          <input
            value={searchValue}
            onChange={onChangeSearchInput}
            placeholder="Поиск..."
          />
        </div>
      </div>

      <div className="grid">{renderItems()}</div>
    </div>
  );
};
export default Home;
