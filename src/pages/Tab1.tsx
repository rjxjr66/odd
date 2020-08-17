import React, { useState, useRef, useEffect } from 'react';
import {
  IonContent, IonPage, IonFab, IonFabButton, IonIcon, IonFabList
} from '@ionic/react';
import './Tab1.scss';
import { menu } from 'ionicons/icons';
import { OddButton } from '../components/OddButton';
import { RouteChildrenProps } from 'react-router';

const Tab1: React.FC<RouteChildrenProps> = ({ history }) => {
  const [fadeIn, setFadeIn] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setFadeIn(true);
    }, 0)
  }, [])

  const keyword = useRef<any>();

  const nearBySearch = () => {
    history.push('/nearby')
  }

  const keywordSearch = () => {
    history.push('/keyword')
  }

  return (
    <IonPage className="Tab1">
      <IonContent>
        <h1>어디대</h1>

        <div className={"fade-in" + (fadeIn ? " active" : '')}>
          <div className="buttons">
            <OddButton onClick={nearBySearch}>주변 검색</OddButton>
            <OddButton onClick={keywordSearch}>키워드 검색</OddButton>
          </div>

          <div className="ellipse Ellipse-1"></div>
          <div className="ellipse Ellipse-2"></div>
          <div className="ellipse Ellipse-3"></div>
          <div className="ellipse Ellipse-4"></div>
          <div className="ellipse Ellipse-5"></div>
          <div className="ellipse Ellipse-6"></div>
          <div className="ellipse Ellipse-7"></div>
          <div className="ellipse Ellipse-8"></div>
          <div className="ellipse Ellipse-12"></div>
        </div>

        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton>
            <IonIcon className="Menu" icon={menu} />
          </IonFabButton>
          <IonFabList side="end">

            <IonFabButton routerLink="/reserve"><IonIcon className="Book" src="assets/Book.svg" /></IonFabButton>
            <IonFabButton routerLink="/mylot"><IonIcon className="Add" src="assets/Add.svg" /></IonFabButton>
            <IonFabButton routerLink="/mypage"><IonIcon className="Myinfo" src="assets/Myinfo.svg" /></IonFabButton>

          </IonFabList>
        </IonFab>
      </IonContent>
    </IonPage>

  );
};

export default Tab1;
