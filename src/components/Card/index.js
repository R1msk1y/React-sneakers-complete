import ContentLoader from "react-content-loader";
import styles from "./Card.module.scss";

import AppContext from "../../context";
import React, { useEffect, useState } from "react";
const Card = ({
  imageUrl,
  title,
  price,
  id,
  onFavorite,
  onPlus,
  favorited = false,
  added = false,
  loading = false,
}) => {
  const { isItemAdded } = React.useContext(AppContext);

  const [isFavorite, setIsFavorite] = useState(favorited);
  const onClickPlus = () => {
    onPlus({ imageUrl, title, price, id });
  };
  const onClickFavorite = () => {
    onFavorite({ imageUrl, title, price, id });
    setIsFavorite(!isFavorite);
  };

  return loading ? (
    <ContentLoader
      className="test"
      speed={2}
      width={155}
      height={250}
      viewBox="0 0 155 265"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="1" y="0" rx="10" ry="10" width="155" height="155" />
      <rect x="0" y="167" rx="5" ry="5" width="155" height="15" />
      <rect x="0" y="187" rx="5" ry="5" width="100" height="15" />
      <rect x="1" y="234" rx="5" ry="5" width="80" height="25" />
      <rect x="124" y="230" rx="10" ry="10" width="32" height="32" />
    </ContentLoader>
  ) : (
    <div className={styles.card}>
      <div className={styles.favorite}>
        <img
          onClick={onClickFavorite}
          src={
            isFavorite
              ? "/img/icons/heart_liked.svg"
              : "/img/icons/heart_unliked.svg"
          }
          alt="Unliked"
        />
      </div>

      <img width={133} height={112} src={imageUrl} alt="Sneakers" />
      <h5>{title}</h5>
      <div className="d-flex justify-between align-center">
        <div className="d-flex flex-column ">
          <span>Цена:</span>
          <b>{price} руб.</b>
        </div>
        <button onClick={onClickPlus} className={styles.button}>
          <img
            src={
              isItemAdded(id) ? "/img/icons/checked.svg" : "/img/icons/plus.svg"
            }
            alt="plus"
          />
        </button>
      </div>
    </div>
  );
};
export default Card;
