import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonBackButton, IonList, IonItem, IonLabel, IonText, IonFooter, IonAlert } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { ParkingLot } from '../models/ParkingLot';
import locationService from '../services/location.service';



const LocationInfo: React.FC<RouteComponentProps<{ id: string; tab: string; }>> = ({ match }) => {
    const [showAlert, setShowAlert] = React.useState<boolean>(false);
    const [info, setInfo] = React.useState<ParkingLot | null>(null);

    const getInfo = async ()=>setInfo(await locationService.getInfo(match.params.id))

    if (!info) {
        getInfo()
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>주차장 정보</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <img src="https://shareditassets.s3.ap-northeast-2.amazonaws.com/production/uploads/post/featured_image/936/%EB%A7%9B%EC%A7%91.JPG"></img>

                <IonList>
                    <IonItem>
                        <IonLabel>
                            <IonText>
                                <h2>주소</h2>
                            </IonText>
                        <p>{ info?.address }</p>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>
                            <IonText>
                                <h2>시간</h2>
                            </IonText>
                        <p>{info?.startDttm}~{info?.endDttm}</p>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>
                            <IonText>
                                <h2>주차공간</h2>
                            </IonText>
                            <p>{info?.name}</p>
                        </IonLabel>
                    </IonItem>
                </IonList>
            </IonContent>
            <IonFooter>
                <IonButton 
                    expand="full" onClick={() => setShowAlert(true)}
                    color={match.params.tab=='1'?'primary':'danger'}
                >
                    {match.params.tab=='1'?'예약하기':(match.params.tab=='2'?'예약취소':'등록취소')}
                </IonButton>
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    subHeader={info?.name}
                    message={`${info?.startDttm}~${info?.endDttm}`}
                    buttons={['취소', {
                        text: '확인',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: () => {
                          
                        }
                      }]}
                />
            </IonFooter>
        </IonPage>
    );
}

export default LocationInfo;