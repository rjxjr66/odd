import React, { useState, useRef } from 'react';
import {
  IonContent, IonHeader, IonPage, IonSearchbar, IonList, IonItem, IonLabel,
  IonTitle, IonToolbar, IonButton,
  IonGrid, IonRow, IonCol, IonButtons, IonBackButton, IonFab, IonFabButton, IonIcon, IonFabList
} from '@ionic/react';
import './Tab1.css';
import ParkingList from '../components/ParkingList';
import { ParkingLot } from '../models/ParkingLot';
import LocationService from '../services/location.service'
import { Geolocation } from '@ionic-native/geolocation';
import { menu, personCircle } from 'ionicons/icons';

const Tab1: React.FC = () => {
  const [showSearchbar, setShowSearchbar] = useState(false);
  const [searchResult, setSearchResult] = useState<ParkingLot[]>([]);

  const keyword = useRef<any>();

  const nearBySearch = async () => {
    const position = await Geolocation.getCurrentPosition()
    console.log(position);
    setSearchResult(await LocationService.searchNearBy(position.coords.latitude, position.coords.longitude))
  }

  const keywordSearch = async () => {
    setSearchResult(await LocationService.searchByKeyword(keyword.current.value));
  }

  function searchBar() {
    return (
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonSearchbar ref={keyword}></IonSearchbar>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonButton onClick={keywordSearch} expand="full">검색</IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  }

  return (
    <IonPage>
      <IonContent>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonButton onClick={nearBySearch} expand="full">주변 검색</IonButton>
          </IonCol>
          <IonCol>
            <IonButton onClick={() => setShowSearchbar(!showSearchbar)} expand="full">키워드 검색</IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>

      {
        showSearchbar ? searchBar() : null
      }
      <ParkingList list={searchResult} removable={false} tab="1"></ParkingList>
      <IonFab vertical="bottom" horizontal="start" slot="fixed">
        <IonFabButton>
          <IonIcon icon={menu} />
        </IonFabButton>
        <IonFabList side="end">
          <IonFabButton routerLink="/reserve">예약</IonFabButton>
          <IonFabButton routerLink="/mylot">등록</IonFabButton>
          <IonFabButton routerLink="/mypage"><IonIcon icon={personCircle} /></IonFabButton>
        </IonFabList>
      </IonFab>
      </IonContent>
    </IonPage>

  );
};

export default Tab1;
