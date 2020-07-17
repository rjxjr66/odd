import react from 'react';
import { IonList, IonItem, IonLabel, IonText, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/react';
import React from 'react';
import { ParkingLot } from '../models/ParkingLot';
import { ParkingItem } from './ParkingItem';

interface ParkingListProp {
    list: ParkingLot[]
    removable: boolean,
    tab: string
}

const ParkingList: React.FC<ParkingListProp> = ({ list }) => {
    if (!list) {
        list = []
    }
    
    return (
        <IonList>
            { list.map((value, index) => <ParkingItem key={value.id} item={value}></ParkingItem>) }
        </IonList>
    )
}

export default ParkingList;