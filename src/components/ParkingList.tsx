import react from 'react';
import { IonList, IonItem, IonLabel, IonText, IonItemSliding, IonItemOptions, IonItemOption } from '@ionic/react';
import React from 'react';
import { ParkingLot } from '../models/ParkingLot';

interface ParkingListProp {
    list: ParkingLot[]
    removable: boolean,
    tab: string
}

const ParkingList: React.FC<ParkingListProp> = ({ list, removable, tab }) => {
    if (!list) {
        list = []
    }
    
    return (
        <IonList>
            {
                list.map((value, index) => {
                    if (removable) {
                        return (
                            <IonItemSliding key={value.id}>
                                {displayItem(tab, value)}
                                <IonItemOptions side="end">
                                    <IonItemOption color="danger" onClick={() => console.log('삭제됨')}>삭제</IonItemOption>
                                </IonItemOptions>
                            </IonItemSliding>
                        )
                    } else {
                        return displayItem(tab, value)
                    }
                })
            }
        </IonList>
    )
}

function displayItem(tab: string, value: ParkingLot) {
    return (
        <IonItem key={value.id} routerLink={`/info/${tab}/${value.id}`}>
            <IonLabel>
                <IonText>
                    <h2>{value.name}</h2>
                </IonText>
                <p>{value.address}</p>
            </IonLabel>
        </IonItem>
    );
}

export default ParkingList;