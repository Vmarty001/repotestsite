import React, { useCallback, useEffect, useState } from 'react';
import './Form.css';
import { useTelegram } from "../../hooks/useTelegram";
import { useLocation } from 'react-router-dom'; // Импорт useLocation для получения состояния

const Form = () => {
    const [city, setCity] = useState('');
    const [sdekaddress, setSdek] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('physical');
    const { tg } = useTelegram();
    const location = useLocation(); // Получение состояния из location
    const { addedItems } = location.state || { addedItems: [] }; // Извлечение addedItems из состояния

    const onSendData = useCallback(() => {
        const data = {
            city,
            sdekaddress,
            subject,
            phone,
            addedItems, // Добавление списка товаров к данным формы
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
        <div className={"form"}>
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
                placeholder={'Адрес'}
                value={sdekaddress}
                onChange={onChangeSdek}
            />
            <input
                className={'input'}
                type="text"
                placeholder={'Телефон'}
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
