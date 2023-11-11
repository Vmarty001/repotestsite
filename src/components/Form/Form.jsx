import React, { useCallback, useEffect, useState } from 'react';
import './Form.css';
import { useTelegram } from "../../hooks/useTelegram";

const Form = () => {
    const [city, setCity] = useState('');
    const [sdekaddress, setSdek] = useState(''); // Fixed typo here, changed setStreet to setSdek
    const [phone,setPhone] = useState('');
    const [subject, setSubject] = useState('physical');
    const { tg } = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            city, // Fixed typo here, changed country to city
            sdekaddress, // Fixed typo here, changed street to sdekaddress
            subject,
            phone
        }
        tg.sendData(JSON.stringify(data));
    }, [city, sdekaddress, subject, phone]); // Fixed typo here, changed country and street to city and sdekaddress

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData);
        return () => {
            tg.offEvent('mainButtonClicked', onSendData);
        }
    }, [onSendData]);

    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Отправить данные'
        });
    }, [tg.MainButton]);

    useEffect(() => {
        if (!city || !sdekaddress || !phone) { // Fixed typo here, changed street to sdekaddress
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [city, sdekaddress,phone]); // Fixed typo here, changed country and street to city and sdekaddress

    const onChangeCity = (e) => {
        setCity(e.target.value);
    }

    const onChangeSdek = (e) => { // Fixed typo here, changed setSubject to setSdek
        setSdek(e.target.value);
    }

    const onChangeSubject = (e) => {
        setSubject(e.target.value);
    }
    const onChangePhone = (e) => {
        setSubject(e.target.value);
    }

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
        </div>
    );
};

export default Form;
