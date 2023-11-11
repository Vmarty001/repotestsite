import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Импортируем компонент Link
import './ProductList.css';
import ProductItem from '../ProductItem/ProductItem';
import { useTelegram } from '../../hooks/useTelegram';
import { useCallback, useEffect } from 'react';
import Nike from './images/pinknike.jpg';
import Nike1 from './images/2023-11-10 23.55.38.jpg';
import Nike3 from './images/2023-11-10 23.55.33.jpg';
import Nike4 from './images/2023-11-10 23.55.23.jpg';
import Nike5 from './images/2023-11-10 23.55.27.jpg';
import Nike6 from './images/2023-11-10 23.55.19.jpg';
import Nike7 from './images/2023-11-10 23.55.15.jpg';
import Nike8 from './images/2023-11-10 23.55.10.jpg';

const products = [
  { id: '1', title: 'Название1', price: 5000, description: 'Синего цвета, прямые', img: Nike },
  { id: '2', title: 'Название1', price: 12000, description: 'Зеленого цвета, теплая', img: Nike1 },
  { id: '3', title: 'Название 2', price: 5000, description: 'Синего цвета, прямые', img: Nike3 },
  { id: '4', title: 'Название 8', price: 122, description: 'Зеленого цвета, теплая', img: Nike4 },
  { id: '5', title: 'Название 3', price: 5000, description: 'Синего цвета, прямые', img: Nike5 },
  { id: '6', title: 'Название 7', price: 600, description: 'Зеленого цвета, теплая', img: Nike6 },
  { id: '7', title: 'Название 4', price: 5500, description: 'Синего цвета, прямые', img: Nike7 },
  { id: '8', title: 'Название 5', price: 12000, description: 'Зеленого цвета, теплая', img: Nike8 },
];

const getTotalPrice = (items = []) => {
  return items.reduce((acc, item) => {
    return (acc += item.price);
  }, 0);
};

const ProductList = () => {
  const [addedItems, setAddedItems] = useState([]);
  const { tg, queryId } = useTelegram();

  const onSendData = useCallback(() => {
    const data = {
      products: addedItems,
      totalPrice: getTotalPrice(addedItems),
      queryId,
    };
    fetch('http://85.119.146.179:8000/web-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }, [addedItems, queryId]);

  useEffect(() => {
    tg.onEvent('mainButtonClicked', onSendData);
    return () => {
      tg.offEvent('mainButtonClicked', onSendData);
    };
  }, [onSendData]);

  const onAdd = (product) => {
    const alreadyAdded = addedItems.find((item) => item.id === product.id);
    let newItems = [];

    if (alreadyAdded) {
      newItems = addedItems.filter((item) => item.id !== product.id);
    } else {
      newItems = [...addedItems, product];
    }

    setAddedItems(newItems);

    if (newItems.length === 0) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
      tg.MainButton.setParams({
        text: `Купить ${getTotalPrice(newItems)}`,
      });
    }
  };

  return (
      <div className={'list'}>
        {products.map((item) => (
            <ProductItem key={item.id} product={item} onAdd={onAdd} className={'item'} />
        ))}
        {/* Добавляем кнопку Link */}
        <Link to="/form">
          <button>Заполнить форму</button>
        </Link>
      </div>
  );
};

export default ProductList;
