import React, { useState, useEffect, useCallback } from 'react';
import './ProductList.css';
import ProductItem from '../ProductItem/ProductItem';
import { useTelegram } from '../../hooks/useTelegram';
import { Link } from 'react-router-dom'; // Импорт Link для маршрутизации
import Nike from './images/pinknike.jpg';
import Nike1 from './images/2023-11-10 23.55.38.jpg';
import Nike3 from './images/2023-11-10 23.55.33.jpg';
import Nike4 from './images/2023-11-10 23.55.23.jpg';
import Nike5 from './images/2023-11-10 23.55.27.jpg';
import Nike6 from './images/2023-11-10 23.55.19.jpg';
import Nike7 from './images/2023-11-10 23.55.15.jpg';
import Nike8 from './images/2023-11-10 23.55.10.jpg';
import ballenciaga from 'https://images.51microshop.com/713/product/20180725/copy_of_Balenciaga_BB_logo_T_shirts_1532528558481_4.jpg';

const products = [
  { id: '1', title: 'Nike Air Max', prices: { '41': 1500, '42': 6000, '43': 7000 }, description: 'Мягкая подошва', img: Nike, sizes: ['41', '42', '43'], category: 'Новое' },
  { id: '2', title: 'Nike Exclusive', prices: { '41': 1212, '42': 13000, '43': 14000 }, description: 'Супер коллекция', img: ballenciaga, sizes: ['41', '42', '43'], category: 'Кроссовки' },
  { id: '3', title: 'Футболка Balenciaga', prices: { 'S': 12312, 'M': 6000, 'L': 7000,'XL': 7000 }, description: 'Самое популярное', img: Nike3, sizes: ['S', 'M', 'L','XL'], category: 'Новое' },
  { id: '4', title: 'Свитшот OffWhite', prices: { 'S': 5551, 'M': 133, 'XL': 144 }, description: 'Демисезон', img: Nike4, sizes: ['S', 'M', 'XL'], category: 'Одежда' },
  { id: '5', title: 'Трусы CK', prices: { 'XS': 1321, 'S': 6000, 'L': 7000 }, description: 'Мужские. Новая коллекция', img: Nike5, sizes: ['XS', 'S', 'L'], category: 'Одежда' },
  { id: '6', title: 'Nike Dunk', prices: { '41': 1555, '42': 700, '43': 800 }, description: 'Эксклюзив. Импортные.', img: Nike6, sizes: ['41', '42', '43'], category: 'Кроссовки' },
  { id: '7', title: 'Цепь', prices: { '6,35': 1943, '8,25': 6500, '9,5': 7500 }, description: 'Золото, мужская', img: Nike7, sizes: ['6,35', '8,25', '9,5'], category: 'Новое' },
  { id: '8', title: 'Джинсы Collab', prices: { 'M': 12, 'L': 13000}, description: 'Синего цвета, зауженные', img: Nike8, sizes: ['M', 'L'], category: 'Одежда' },
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
    fetch('http://45.89.188.162:8000/web-data', {
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
    //  tg.MainButton.show();
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
    let filtered = [];
    if (activeCategory === 'Новое') {
      filtered = products.slice().sort((a, b) => b.id - a.id);
    } else {
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
        {addedItems.length > 0 && (
            <Link to='/form' state={{ addedItems }}> {/* Передача списка добавленных товаров через параметры запроса */}
              <button className="checkout-button">Перейти к оформлению</button>
            </Link>
        )}
      </div>
  );
};

export default ProductList;
