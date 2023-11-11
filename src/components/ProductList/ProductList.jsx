// ProductList.jsx
import React, { useState } from 'react';
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
  { id: '1', title: 'Название1', prices: { '41': 5000, '42': 6000, '43': 7000 }, description: 'Синего цвета, прямые', img: Nike, sizes: ['41', '42', '43'] },
  { id: '2', title: 'Название1', prices: { '41': 12000, '42': 13000, '43': 14000 }, description: 'Зеленого цвета, теплая', img: Nike1, sizes: ['41', '42', '43'] },
  { id: '3', title: 'Название 2', prices: { '41': 5000, '42': 6000, '43': 7000 }, description: 'Синего цвета, прямые', img: Nike3, sizes: ['41', '42', '43'] },
  { id: '4', title: 'Название 8', prices: { '41': 122, '42': 133, '43': 144 }, description: 'Зеленого цвета, теплая', img: Nike4, sizes: ['41', '42', '43'] },
  { id: '5', title: 'Название 3', prices: { '41': 5000, '42': 6000, '43': 7000 }, description: 'Синего цвета, прямые', img: Nike5, sizes: ['41', '42', '43'] },
  { id: '6', title: 'Название 7', prices: { '41': 600, '42': 700, '43': 800 }, description: 'Зеленого цвета, теплая', img: Nike6, sizes: ['41', '42', '43'] },
  { id: '7', title: 'Название 4', prices: { '41': 5500, '42': 6500, '43': 7500 }, description: 'Синего цвета, прямые', img: Nike7, sizes: ['41', '42', '43'] },
  { id: '8', title: 'Название 5', prices: { '41': 12000, '42': 13000, '43': 14000 }, description: 'Зеленого цвета, теплая', img: Nike8, sizes: ['41', '42', '43'] },
];


const getTotalPrice = (items = []) => {
  return items.reduce((acc, item) => {
    const itemPrice = item.prices[item.selectedSize] || 0;
    return (acc += itemPrice);
  }, 0);
};

const ProductList = () => {
  const [addedItems, setAddedItems] = useState([]);
  const { tg, queryId } = useTelegram();

  const onSendData = useCallback(() => {
    const data = {
      products: addedItems.map(({ selectedSize, ...rest }) => ({ ...rest, size: selectedSize })),
      totalPrice: getTotalPrice(addedItems),
      queryId,
    };
    fetch('http://localhost:8000', {
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
    setAddedItems([...addedItems, product]);

    if (addedItems.length === 0) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
      tg.MainButton.setParams({
        text: `Купить ${getTotalPrice([...addedItems, product])}`,
      });
    }
  };

  return (
      <div className={'list'}>
        {products.map((item) => (
            <ProductItem key={item.id} product={item} onAdd={onAdd} className={'item'} />
        ))}
      </div>
  );
};

export default ProductList;
