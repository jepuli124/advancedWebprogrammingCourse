import React from 'react';
import { useTranslation } from 'react-i18next';


const Header: React.FC = () => {
    const {t, i18n} = useTranslation()
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng)
    }

    return (
        <>
            <nav className="header">
                <h1>
                    title
                </h1>
                <ul>
                    <a href='/'>{t("Home")}</a>
                    <a href='/about'>{t("About")}</a>
                    <button onClick={()=>changeLanguage("fi")} id='fi'>FI</button>
                    <button onClick={()=>changeLanguage("en")} id='en'>EN</button>
                </ul>
            </nav>
        </>
    )
}


export default Header
