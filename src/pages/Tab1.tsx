import React, { useState, useRef } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonSearchbar, IonList, IonItem, IonLabel,
  IonTitle, IonToolbar, IonButton,
  IonGrid, IonRow, IonCol
} from '@ionic/react';
import './Tab1.css';
import ParkingList from '../components/ParkingList';
import { ParkingLot } from '../models/ParkingLot';
import LocationService from '../services/location.service'

const Tab1: React.FC = () => {
  const [showSearchbar, setShowSearchbar] = useState(false);
  const [searchResult, setSearchResult] = useState<ParkingLot[]>([]);

  const keyword = useRef<any>();

  const nearBySearch = ()=>{
    navigator.geolocation.getCurrentPosition(async (position) => {
      setSearchResult(await LocationService.searchNearBy(position.coords.latitude, position.coords.longitude))
    });
  }

  const keywordSearch = async ()=>{
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
      <IonHeader>
        <IonToolbar>
          <IonTitle>주차공간검색</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">검색</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonButton onClick={nearBySearch} expand="full">주변 검색</IonButton>
            </IonCol>
            <IonCol>
              <IonButton onClick={()=>setShowSearchbar(!showSearchbar)} expand="full">키워드 검색</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        {
          showSearchbar?searchBar():null
        }
        <ParkingList list={searchResult} removable={false} tab="1"></ParkingList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
