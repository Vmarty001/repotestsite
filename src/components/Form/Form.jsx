import React, { useCallback, useEffect, useState } from 'react';
import './Form.css';
import { useTelegram } from "../../hooks/useTelegram";
import { useLocation } from 'react-router-dom';

const Form = () => {
    const [city, setCity] = useState('');
    const [sdekaddress, setSdek] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('physical');
    const { tg } = useTelegram();
    const location = useLocation();
    const { addedItems } = location.state || { addedItems: [] };

    const onSendData = useCallback(() => {
        const data = {
            city,
            sdekaddress,
            subject,
            phone,
            addedItems,
        };
        tg.sendData(JSON.stringify(data));
    }, [city, sdekaddress, subject, phone, addedItems]);

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData);
        return () => {
            tg.offEvent('mainButtonClicked', onSendData);
        };
    }, [onSendData]);

    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Отправить данные'
        });
    }, [tg.MainButton]);

    useEffect(() => {
        if (!city || !sdekaddress || !phone) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [city, sdekaddress, phone]);

    const onChangeCity = (e) => {
        setCity(e.target.value);
    };

    const onChangeSdek = (e) => {
        setSdek(e.target.value);
    };

    const onChangePhone = (e) => {
        setPhone(e.target.value);
    };


        const onChangeSubject = (e) => {
            setSubject(e.target.value);
        };

        return (
            <div className="form">
                <h3>Введите ваши данные</h3>
                <input
                    className="input"
                    type="text"
                    placeholder="Город"
                    value={city}
                    onChange={onChangeCity}
                />
                <input
                    className="input"
                    type="text"
                    placeholder="Адрес"
                    value={sdekaddress}
                    onChange={onChangeSdek}
                />
                <input
                    className="input"
                    type="text"
                    placeholder="Телефон"
                    value={phone}
                    onChange={onChangePhone}
                />
                <select value={subject} onChange={onChangeSubject} className="select">
                    <option value="physical">Физ. лицо</option>
                    <option value="legal">Юр. лицо</option>
                </select>

                <h3>Товары в корзине</h3>
                <div className="cart-items">
                    {addedItems.length > 0 ? (
                        addedItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img src={item.img} alt={item.title} />
                                <div className="cart-item-info">
                                    <div className="cart-item-title">{item.title}</div>
                                    <div className="cart-item-size">Размер: {item.selectedSize}</div>
                                    <div className="cart-item-price">Цена: {item.price} ₽</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>Корзина пуста</div>
                    )}
                </div>
            </div>
        );
    };

    export default Form;
