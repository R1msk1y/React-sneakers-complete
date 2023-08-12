import React, { useState } from "react";
import Info from "./Info";
import AppContext from "../context";
import axios from "axios";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Drawer = ({ onClose, onRemove, items }) => {
  const { cartItems, setCartItems } = React.useContext(AppContext);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const totalPrice = cartItems.reduce((sum, obj) => obj.price + sum, 0);
  const onClickOrder = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        "https://63eb5803f1a969340db5fcc4.mockapi.io/orders",
        {
          items: cartItems,
        }
      );
      // await axios.put("https://64a92ab28b9afaf4844a55dd.mockapi.io/cart", []);
      setOrderId(data.id);
      setIsOrderComplete(true);
      setCartItems([]);
      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        await axios.delete(
          "https://64a92ab28b9afaf4844a55dd.mockapi.io/cart/" + item.id
        );
        await delay(1000);
      }
    } catch (err) {
      alert("Не удалось создать заказ");
    }
    setIsLoading(false);
  };
  return (
    <div className="overlay">
      <div className="drawer">
        <h3 className="d-flex justify-between mb-30">
          Корзина
          <img
            onClick={onClose}
            className="removeBtn cu-p"
            src="/img/icons/btn_remove.svg"
            alt="btn_remove"
          />
        </h3>
        {items.length > 0 ? (
          <div className="d-flex flex-column flex">
            <div className="items">
              {items.map((obj) => {
                return (
                  <div
                    key={obj.id}
                    className="cartItem d-flex align-center mb-20"
                  >
                    <div
                      style={{
                        backgroundImage: `url(${obj.imageUrl})`,
                      }}
                      className="cartItemImg"
                    ></div>

                    <div className="mr-20 ">
                      <p className="mb-5">{obj.title}</p>
                      <b>{obj.price} руб.</b>
                    </div>
                    <img
                      onClick={() => {
                        onRemove(obj.id);
                      }}
                      className="removeBtn"
                      src="/img/icons/btn_remove.svg"
                      alt="btn_remove"
                    />
                  </div>
                );
              })}
            </div>
            <div className="cartTotalBlock">
              <ul>
                <li>
                  <span className="d-flex">Итого:</span>
                  <div></div>
                  <b>{totalPrice} руб.</b>
                </li>
                <li>
                  <span className="d-flex">Налог 5%</span>
                  <div></div>
                  <b>{(totalPrice / 100) * 5} руб.</b>
                </li>
              </ul>
              <button
                disabled={isLoading}
                onClick={onClickOrder}
                className="greenButton"
              >
                Оформить заказ
                <img src="/img/icons/arrow.svg" alt="arrow" />
              </button>
            </div>
          </div>
        ) : (
          <Info
            title={isOrderComplete ? "Заказ оформлен!" : "Корзина пуста"}
            description={
              isOrderComplete
                ? `Ваш заказ #${orderId} скоро будет передан нашей курьерской службой`
                : "Добавьте хотябы один товар!"
            }
            image={
              isOrderComplete
                ? "/img/complete-order.jpg"
                : "/img/cart-empty.jpg"
            }
          />
        )}
      </div>
    </div>
  );
};
export default Drawer;
