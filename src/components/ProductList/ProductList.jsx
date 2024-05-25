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
  return items.reduce((acc, item) => acc + item.price, 0);
};

const ProductList = () => {
  const [addedItems, setAddedItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Новое');
  const { tg } = useTelegram();

  useEffect(() => {
    tg.onEvent('mainButtonClicked', handleMainButtonClick);
    return () => {
      tg.offEvent('mainButtonClicked', handleMainButtonClick);
    };
  }, []);

  const handleMainButtonClick = useCallback(() => {
    // Действие при нажатии на кнопку
  }, []);

  const handleAddToCart = (product) => {
    const index = addedItems.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      const newItems = [...addedItems];
      newItems.splice(index, 1);
      setAddedItems(newItems);
    } else {
      setAddedItems([...addedItems, product]);
    }
  };

  useEffect(() => {
    if (addedItems.length === 0) {
      tg.MainButton.hide();
    } else {
      const totalPrice = getTotalPrice(addedItems);
      tg.MainButton.show();
      tg.MainButton.setParams({
        text: `Купить ${totalPrice}`
      });
    }
  }, [addedItems, tg.MainButton]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const filteredProducts = activeCategory === 'Новое' ? products : products.filter(product => product.category === activeCategory);

  return (
      <div className="product-list">
        <div className="categories">
          {['Новое', 'Кроссовки', 'Одежда'].map((category) => (
              <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={activeCategory === category ? 'active' : ''}
              >
                {category}
              </button>
          ))}
        </div>
        <div className="product-list-items">
          {filteredProducts.map((product) => (
              <ProductItem
                  key={product.id}
                  product={product}
                  onAdd={handleAddToCart}
                  inCart={addedItems.some(item => item.id === product.id)}
                  className="product-item"
              />
          ))}
        </div>
      </div>
  );
};

export default ProductList;