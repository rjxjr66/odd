import { IonHeader, IonToolbar, IonTitle, IonPage, IonContent, IonList, IonItem, IonLabel, IonButton, IonText } from "@ionic/react"
import React from "react";
import UserService from '../services/user.service'
import { RouteComponentProps } from "react-router";

const Tab4: React.FC<RouteComponentProps> = ({ history }) => {
    const logout = async () => {
        await UserService.logout();
        history.replace('/login');
    }
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        내 정보
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
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