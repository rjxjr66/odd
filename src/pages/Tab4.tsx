import { IonHeader, IonToolbar, IonTitle, IonPage, IonContent, IonList, IonItem, IonLabel, IonButton, IonText } from "@ionic/react"
import React from "react";
import UserService from '../services/user.service'
import { RouteComponentProps } from "react-router";
import { OddHeader } from "../components/OddHeader";

const Tab4: React.FC<{ history: any }> = ({ history }) => {
    const logout = async () => {
        await UserService.logout();
        history.replace('/login');
    }

    const [scrollY, setScrollY] = React.useState<number>(0);

    return (
        <IonPage>
            <IonContent className="white" scrollEvents={true} onIonScroll={(ev)=>setScrollY(ev.detail.scrollTop)}>
            <OddHeader history={history} scrollY={scrollY}>예약목록</OddHeader>
            <IonList>
                <IonItem>
                    <IonLabel>이름</IonLabel>
                    <IonText>{UserService.currentUser.name}</IonText>
                </IonItem>
                <IonItem>
                    <IonLabel>차량번호</IonLabel>
                    <IonText>{UserService.currentUser.carNumber}</IonText>
                </IonItem>
                <IonItem>
                    <IonLabel>로그아웃</IonLabel>
                    <IonButton color="danger" onClick={logout}>로그아웃</IonButton>
                </IonItem>
            </IonList>
            </IonContent>
        </IonPage>
    )
}

export default Tab4;