import React from 'react';
import Button from "../Button/Button";
import {useTelegram} from "../../hooks/useTelegram";
import './Header.css';
import Logo from './Logo';

const Header = () => {
    const {user, onClose} = useTelegram();

    return (
        <div>
            <div className={'logo'}>
                <Logo />
            </div>
            <div className={'header'}>

                <span className={'username'}>
                    {user?.username}
                </span>
            </div>
        </div>
    );
};

export default Header;
