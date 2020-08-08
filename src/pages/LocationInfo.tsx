import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonBackButton, IonList, IonItem, IonLabel, IonText, IonFooter, IonAlert } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { ParkingLot } from '../models/ParkingLot';
import locationService from '../services/location.service';
import { OddHeader } from '../components/OddHeader';
import { OddModal } from '../components/OddModal';



const LocationInfo: React.FC<RouteComponentProps<{ id: string; tab: string; }>> = ({ match, history }) => {
    const [showAlert, setShowAlert] = React.useState<boolean>(false);
    const [ unlocked, setUnlocked ] = React.useState<boolean>(false); 
    const [info, setInfo] = React.useState<ParkingLot | null>(null);

    const getInfo = async ()=>setInfo(await locationService.getInfo(match.params.id))
    const unlock = async ()=>{
        if (unlocked) {
            await locationService.lock();
            setUnlocked(false)
        } else {
            await locationService.unlock()
            setUnlocked(true)
        }
    }

    if (!info) {
        getInfo()
    }

    const [scrollY, setScrollY] = React.useState<number>(0);

    return (
        <IonPage>
            <IonContent className="white" scrollEvents={true} onIonScroll={(ev)=>setScrollY(ev.detail.scrollTop)}>
                <OddHeader history={history} scrollY={scrollY}>주차장 상세</OddHeader>
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
                                <h2>주차장 이름</h2>
                            </IonText>
                            <p>{info?.name}</p>
                        </IonLabel>
                    </IonItem>
                </IonList>
                <OddModal title=""></OddModal>
            </IonContent>
            {/*
            <IonFooter>
                {match.params.tab=='2'?
                <IonButton 
                    expand="full" onClick={() => unlock()} color='primary'
                >
                    { !unlocked ? '사용하기' : '사용종료' }
                </IonButton>
                :''}
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
                        text: match.params.tab=='1'?'예약하기':(match.params.tab=='2'?'예약취소':'등록취소'),
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: async () => {
                          switch (match.params.tab) {
                              case '1':
                                await locationService.book(match.params.id)
                                alert('예약이 완료되었습니다.')
                              break;
                              case '2':
                                await locationService.cancel(match.params.id)
                                alert('취소되었습니다.')
                                history.goBack()
                              break;
                              case '3':
                                await locationService.delete(match.params.id)
                                alert('삭제가 완료되었습니다.')
                                history.goBack()
                              break;
                          }
                        }
                      }]}
                />
            </IonFooter>
            */}
        </IonPage>
    );
}

export default LocationInfo;