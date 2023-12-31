import React, { useState, useEffect, useCallback } from 'react';
import './ProductList.css';
import ProductItem from '../ProductItem/ProductItem';
import { useTelegram } from '../../hooks/useTelegram';
import Nike from './images/pinknike.jpg';
import Nike1 from './images/2023-11-10 23.55.38.jpg';
import Nike3 from './images/2023-11-10 23.55.33.jpg';
import Nike4 from './images/2023-11-10 23.55.23.jpg';
import Nike5 from './images/2023-11-10 23.55.27.jpg';
import Nike6 from './images/2023-11-10 23.55.19.jpg';
import Nike7 from './images/2023-11-10 23.55.15.jpg';
import Nike8 from './images/2023-11-10 23.55.10.jpg';

const products = [
  { id: '1', title: 'Название1', prices: { '41': 5000, '42': 6000, '43': 7000 }, description: 'Синего цвета, прямые', img: Nike, sizes: ['41', '42', '43'], category: 'Новое' },
  { id: '2', title: 'Название1', prices: { '41': 12000, '42': 13000, '43': 14000 }, description: 'Зеленого цвета, теплая', img: Nike1, sizes: ['41', '42', '43'], category: 'Кроссовки' },
  { id: '3', title: 'Название 2', prices: { '41': 5000, '42': 6000, '43': 7000 }, description: 'Синего цвета, прямые', img: Nike3, sizes: ['41', '42', '43'], category: 'Новое' },
  { id: '4', title: 'Название 8', prices: { '41': 122, '42': 133, '43': 144 }, description: 'Зеленого цвета, теплая', img: Nike4, sizes: ['41', '42', '43'], category: 'Одежда' },
  { id: '5', title: 'Название 3', prices: { '41': 5000, '42': 6000, '43': 7000 }, description: 'Синего цвета, прямые', img: Nike5, sizes: ['41', '42', '43'], category: 'Одежда' },
  { id: '6', title: 'Название 7', prices: { '41': 600, '42': 700, '43': 800 }, description: 'Зеленого цвета, теплая', img: Nike6, sizes: ['41', '42', '43'], category: 'Кроссовки' },
  { id: '7', title: 'Название 4', prices: { '41': 5500, '42': '6500', '43': 7500 }, description: 'Синего цвета, прямые', img: Nike7, sizes: ['41', '42', '43'], category: 'Новое' },
  { id: '8', title: 'Название 5', prices: { '41': 12000, '42': 13000, '43': 14000 }, description: 'Зеленого цвета, теплая', img: Nike8, sizes: ['41', '42', '43'], category: 'Одежда' },
];

const getTotalPrice = (items = []) => {
  return items.reduce((acc, item) => {
    return (acc += item.price);
  }, 0);
};

const ProductList = () => {
  const [addedItems, setAddedItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Новое');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { tg, queryId } = useTelegram();

  const onSendData = useCallback(() => {
    const data = {
      products: addedItems,
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

  const onRemove = (productId) => {
    const updatedItems = addedItems.filter((item) => item.id !== productId);
    setAddedItems(updatedItems);

    if (updatedItems.length === 0) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.setParams({
        text: `Купить ${getTotalPrice(updatedItems)}`,
      });
    }
  };

  useEffect(() => {
    // Фильтруем товары по категории
    let filtered = [];
    if (activeCategory === 'Новое') {
      // Возвращаем все товары, независимо от категории
      filtered = products.slice().sort((a, b) => b.id - a.id);
    } else {
      // Возвращаем товары только выбранной категории
      filtered = products.filter((product) => product.category === activeCategory);
    }
    setFilteredProducts(filtered);
  }, [activeCategory]);

  return (
      <div className={'product-list'}>
        <div className={'categories'}>
          <button onClick={() => setActiveCategory('Новое')} className={activeCategory === 'Новое' ? 'active' : ''}>
            Новое
          </button>
          <button onClick={() => setActiveCategory('Кроссовки')} className={activeCategory === 'Кроссовки' ? 'active' : ''}>
            Кроссовки
          </button>
          <button onClick={() => setActiveCategory('Одежда')} className={activeCategory === 'Одежда' ? 'active' : ''}>
            Одежда
          </button>
        </div>
        <div className={'product-list-items'}>
          {filteredProducts.map((item) => (
              <ProductItem key={item.id} product={item} onAdd={onAdd} onRemove={onRemove} className={'product-item'} />
          ))}
        </div>
      </div>
  );
};

export default ProductList;
