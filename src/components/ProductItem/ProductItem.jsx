import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import './ProductItem.css';

const ProductItem = ({ product, className, onAdd }) => {
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        if (selectedSize) {
            setSelectedProduct({ ...product, selectedSize, price: product.prices[selectedSize] });
        } else {
            setSelectedProduct(null);
        }
    }, [product, selectedSize]);

    const onSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const onAddHandler = () => {
        if (selectedProduct) {
            onAdd(selectedProduct);
        } else {
            alert('Выберите размер');
        }
    };

    return (
        <div className={'product ' + className}>
            <div className={'img'}>
                <img src={product.img} alt={product.title} />
            </div>
            <div className={'title'}>{product.title}</div>
            <div className={'description'}>{product.description}</div>
            <div className={'price'}>
                <span>Стоимость: <b>{product.prices[selectedSize] || 'От...'}</b></span>
            </div>
            <div className={'sizes'}>
                {product.sizes && (
                    <div>
                        Размеры: {product.sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => onSizeSelect(size)}
                            className={selectedSize === size ? 'selected' : ''}
                        >
                            {size}
                        </button>
                    ))}
                    </div>
                )}
            </div>
            <Button className={'add-btn'} onClick={onAddHandler}>
                {selectedSize ? 'Добавить в корзину' : 'Выберите размер'}
            </Button>
        </div>
    );
};

export default ProductItem;
