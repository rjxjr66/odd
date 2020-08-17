import React from 'react';
import { IonContent, IonPage, IonInput } from '@ionic/react';
import './Keyword.scss';
import ParkingList from '../components/ParkingList';
import { ParkingLot } from '../models/ParkingLot';
import locationService from '../services/location.service';
import { OddHeader } from '../components/OddHeader';
import { RouteComponentProps } from 'react-router';
import { Geolocation } from '@ionic-native/geolocation';

const Keyword: React.FC<RouteComponentProps> = ({ history }) => {
  const [lists, setMyLocation] = React.useState<ParkingLot[] | null>([]);

  const getResult = async (value: string) => {
    if (!value) {
      setMyLocation([])
      return
    }
    setMyLocation(null);
    const position = await Geolocation.getCurrentPosition()
    setMyLocation(await locationService.searchByKeyword(value));
  };

  const [scrollY, setScrollY] = React.useState<number>(0);

  return (
    <IonPage className="Keyword">
      <IonContent className="white" scrollEvents={true} onIonScroll={(ev)=>setScrollY(ev.detail.scrollTop)}>
        <OddHeader history={history} scrollY={scrollY}>키워드</OddHeader>
        <IonInput debounce={200} onIonChange={(e: any)=>getResult(e.target.value)} placeholder="검색어를 입력하세요.."></IonInput>
        <ParkingList history={history} tab="1" list={lists} removable={false}></ParkingList>
      </IonContent>
    </IonPage>
  );
};

export default Keyword;
