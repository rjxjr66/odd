import React from 'react';
import { IonContent, IonPage, useIonViewDidEnter } from '@ionic/react';
import './Nearby.scss';
import ParkingList from '../components/ParkingList';
import { ParkingLot } from '../models/ParkingLot';
import locationService from '../services/location.service';
import { OddHeader } from '../components/OddHeader';
import { RouteComponentProps } from 'react-router';
import { Geolocation } from '@ionic-native/geolocation';

const Nearby: React.FC<RouteComponentProps> = ({ history }) => {
  const [lists, setMyLocation] = React.useState<ParkingLot[] | null>(null);
  useIonViewDidEnter(async () => {
    const position = await Geolocation.getCurrentPosition()
    setMyLocation(await locationService.searchNearBy(position.coords.latitude, position.coords.longitude))
  })

  const [scrollY, setScrollY] = React.useState<number>(0);

  return (
    <IonPage>
      <IonContent className="white" scrollEvents={true} onIonScroll={(ev)=>setScrollY(ev.detail.scrollTop)}>
        <OddHeader history={history} scrollY={scrollY}>주변</OddHeader>
        <ParkingList history={history} tab="1" list={lists} removable={false}></ParkingList>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/><br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/><br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/><br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/><br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/><br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
      </IonContent>
    </IonPage>
  );
};

export default Nearby;
