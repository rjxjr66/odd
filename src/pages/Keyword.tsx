import React, { useState } from 'react';
import { IonContent, IonPage, useIonViewDidEnter } from '@ionic/react';
import './Keyword.css';
import ParkingList from '../components/ParkingList';
import { ParkingLot } from '../models/ParkingLot';
import locationService from '../services/location.service';
import { OddHeader } from '../components/OddHeader';
import { RouteComponentProps } from 'react-router';
import { Geolocation } from '@ionic-native/geolocation';

const Keyword: React.FC<RouteComponentProps> = ({ history }) => {
  const [lists, setMyLocation] = React.useState<ParkingLot[]>([]);
  const keyword = React.useRef<any>();

  const getResult = async () => {
    const position = await Geolocation.getCurrentPosition()
    setMyLocation(await locationService.searchByKeyword(keyword.current.value));
  };

  const [scrollY, setScrollY] = React.useState<number>(0);

  return (
    <IonPage>
      <IonContent className="white" scrollEvents={true} onIonScroll={(ev)=>setScrollY(ev.detail.scrollTop)}>
        <OddHeader history={history} scrollY={scrollY}>키워드</OddHeader>
        <ParkingList history={history} tab="1" list={lists} removable={false}></ParkingList>
      </IonContent>
    </IonPage>
  );
};

export default Keyword;
