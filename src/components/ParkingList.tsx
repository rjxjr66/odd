import react from 'react';
import { IonList, IonItem, IonLabel, IonText, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/react';
import React from 'react';
import { ParkingLot } from '../models/ParkingLot';
import { ParkingItem } from './ParkingItem';
import { RouteComponentProps } from 'react-router';

interface ParkingListProp {
    list: ParkingLot[]
    removable: boolean,
    tab: string,
    history: any
}

const ParkingList: React.FC<ParkingListProp> = ({ list, tab, history }) => {
    if (!list) {
        list = []
    }
    
    return (
        <IonList>
            { list.map((value, index) => <ParkingItem history={history} tab={tab} key={value.id} item={value}></ParkingItem>) }
        </IonList>
    )
}

export default ParkingList;