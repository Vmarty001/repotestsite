import React, { useState } from 'react';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header/Header';
import ProductList from './components/ProductList/ProductList';

function App() {
    const [city, setCity] = useState('');
    const [sdekaddress, setSdek] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('physical');

    const onSendData = () => {
        const data = {
            city,
            sdekaddress,
            subject,
            phone,
        };
        console.log('Sending data:', data); // Вместо отправки данных в Telegram, печатаем их в консоль
    };

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
        <div className="App">
            <Header />
            <Routes>
                <Route index element={<ProductList />} />
                <Route path={'form'}>
                    <div className="form">
                        <h3>Введите ваши данные</h3>
                        <input
                            className="inputField"
                            type="text"
                            placeholder="Город"
                            value={city}
                            onChange={onChangeCity}
                        />
                        <input
                            className="inputField"
                            type="text"
                            placeholder="Адрес пункта выдачи СДЭК. (Постмат нельзя) "
                            value={sdekaddress}
                            onChange={onChangeSdek}
                        />
                        <input
                            className="inputField"
                            type="text"
                            placeholder="Номер телефона"
                            value={phone}
                            onChange={onChangePhone}
                        />
                        <select value={subject} onChange={onChangeSubject} className="selectField">
                            <option value="physical">Физ. лицо</option>
                            <option value="legal">Юр. лицо</option>
                        </select>
                        <button onClick={onSendData}>Отправить данные</button>
                    </div>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
