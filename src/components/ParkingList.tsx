import react from 'react';
import { IonList, IonItem, IonLabel, IonText, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/react';
import React from 'react';
import { ParkingLot } from '../models/ParkingLot';
import { ParkingItem } from './ParkingItem';
import { ParkingItemLoading } from './ParkingItemLoading';

interface ParkingListProp {
    list: ParkingLot[] | null
    removable: boolean,
    tab: string,
    history: any
}

const ParkingList: React.FC<ParkingListProp> = ({ list, tab, history }) => {
    if (list) {
        return (
            <IonList>
                { list.map((value, index) => <ParkingItem history={history} tab={tab} key={value.id} item={value}></ParkingItem>) }
            </IonList>
        )
    } else {
        return (
            <IonList>
                <ParkingItemLoading></ParkingItemLoading>
                <ParkingItemLoading></ParkingItemLoading>
            </IonList>
        )
    }
}

export default ParkingList;