import React, { useState } from 'react';
import Button from '../Button/Button';
import './ProductItem.css';

const ProductItem = ({ product, className, onAdd }) => {
    const [selectedSize, setSelectedSize] = useState(null);

    const onSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const onAddHandler = () => {
        if (!selectedSize) {
            alert('Выберите размер');
            return;
        }

        const selectedProduct = { ...product, selectedSize, price: product.prices[selectedSize] };
        onAdd(selectedProduct);
    };

    return (
        <div className={'product ' + className}>
            <div className={'img'}>
                <img src={product.img} alt={product.title} />
            </div>
            <div className={'title'}>{product.title}</div>
            <div className={'description'}>{product.description}</div>
            <div className={'price'}>
                <span><b>{selectedSize ? product.prices[selectedSize] : `От ${Math.min(...Object.values(product.prices))}`} Rub</b></span>
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
                Добавить в корзину
            </Button>
        </div>
    );
};

export default ProductItem;
