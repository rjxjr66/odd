import React from 'react';
import './ParkingItemLoading.scss'
import { ParkingLot } from '../models/ParkingLot';
import { IonItem, IonAvatar, IonSkeletonText, IonLabel } from '@ionic/react';

export const ParkingItemLoading: React.FC = () => {

    return (
        <div className="parking-lot-loading">
            <IonItem>
              <IonAvatar slot="start">
                <IonSkeletonText animated />
              </IonAvatar>
              <IonLabel>
                <h3>
                  <IonSkeletonText animated style={{ width: '50%' }} />
                </h3>
                <p>
                  <IonSkeletonText animated style={{ width: '80%' }} />
                </p>
                <p>
                  <IonSkeletonText animated style={{ width: '60%' }} />
                </p>
              </IonLabel>
            </IonItem>
        </div>
    )
}