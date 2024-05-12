import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import './ProductItem.css';

const ProductItem = ({ product, className, onAdd, onRemove }) => {
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [inCart, setInCart] = useState(false);
    const [minPrice, setMinPrice] = useState(null);

    useEffect(() => {
        if (selectedSize) {
            setSelectedProduct({ ...product, selectedSize, price: product.prices[selectedSize] });
        } else {
            setSelectedProduct(null);
        }

        // Вычисляем минимальную цену среди всех размеров
        const prices = Object.values(product.prices);
        setMinPrice(Math.min(...prices));
    }, [product, selectedSize]);

    const onSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const onAddHandler = () => {
        if (selectedProduct) {
            onAdd(selectedProduct);
            setInCart(true);
        } else {
            alert('Выберите размер');
        }
    };

    const onRemoveHandler = () => {
        if (selectedProduct) {
            onRemove(selectedProduct.id);
            setInCart(false);
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
                <span><b>{selectedSize ? product.prices[selectedSize] : `От ${minPrice}`}</b></span>
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
            <Button className={'add-btn'} onClick={inCart ? onRemoveHandler : onAddHandler}>
                {inCart ? 'Убрать из корзины' : 'Добавить в корзину'}
            </Button>
        </div>
    );
};

export default ProductItem;
