import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTelegram } from '../../hooks/useTelegram';
import './Form.css';

const Form = () => {
    const location = useLocation();
    const { selectedProducts } = location.state || { selectedProducts: [] };
    const [city, setCity] = useState('');
    const [sdekaddress, setSdek] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('physical');
    const { tg } = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            city,
            sdekaddress,
            subject,
            phone,
        };
        tg.sendData(JSON.stringify(data));
    }, [city, sdekaddress, subject, phone]);

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
        <div className={"form"}>
            <h3>Ваши выбранные товары</h3>
            <ul>
                {selectedProducts.map(product => (
                    <li key={product.id}>
                        <img src={product.img} alt={product.title} />
                        <p>{product.title} - {product.price} руб.</p>
                    </li>
                ))}
            </ul>
            <h3>Введите ваши данные</h3>
            <input
                className={'input'}
                type="text"
                placeholder={'Город'}
                value={city}
                onChange={onChangeCity}
            />
            <input
                className={'input'}
                type="text"
                placeholder={'Адрес пункта выдачи СДЭК. (Постмат нельзя) '}
                value={sdekaddress}
                onChange={onChangeSdek}
            />
            <input
                className={'input'}
                type="text"
                placeholder={'Номер телефона'}
                value={phone}
                onChange={onChangePhone}
            />
            <select value={subject} onChange={onChangeSubject} className={'select'}>
                <option value={'physical'}>Физ. лицо</option>
                <option value={'legal'}>Юр. лицо</option>
            </select>
        </div>
    );
};

export default Form;

