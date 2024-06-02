import React, { useCallback, useEffect, useState } from 'react';
import './Form.css';
import { useTelegram } from "../../hooks/useTelegram";

const Form = ({ addedItems }) => {
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
            items: addedItems // Добавляем товары в данные, которые будут отправлены
        };
        tg.sendData(JSON.stringify(data));
    }, [city, sdekaddress, subject, phone, addedItems, tg]);

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData);
        return () => {
            tg.offEvent('mainButtonClicked', onSendData);
        };
    }, [tg, onSendData]);

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
    }, [city, sdekaddress, phone, tg.MainButton]);

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
            <div className={'cart-items'}>
                <h4>Товары в корзине</h4>
                {addedItems.length === 0 ? (
                    <p>Корзина пуста</p>
                ) : (
                    <ul>
                        {addedItems.map(item => (
                            <li key={item.id}>{item.title} - {item.selectedSize} - {item.price} руб.</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Form;
