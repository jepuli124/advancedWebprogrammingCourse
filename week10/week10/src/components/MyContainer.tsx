import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';




interface IMyContainer {
    text?: string 
}


const MyContainer: React.FC<IMyContainer> = () => {
    const {t, i18n} = useTranslation()
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng)
    }

    return (
        <div>
            <p id="textAreaContainer" onClick={()=> changeLanguage("fi")}>{t("This is the front page")}</p>
        </div>
    )
}


export default function App() {
    return (
      <Suspense fallback="loading">
        <MyContainer />
      </Suspense>
    );
  }