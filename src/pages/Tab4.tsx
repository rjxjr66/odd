import { IonPage, IonContent, IonList, IonItem, IonLabel, IonButton, IonText } from "@ionic/react"
import React from "react";
import UserService from '../services/user.service'
import { OddHeader } from "../components/OddHeader";
import './Tab4.scss';
import { OddButton } from "../components/OddButton";

const Tab4: React.FC<{ history: any }> = ({ history }) => {
    const logout = async () => {
        await UserService.logout();
        history.replace('/login');
    }

    const [scrollY, setScrollY] = React.useState<number>(0);

    return (
        <IonPage className="Tab4">
            <IonContent className="white" scrollEvents={true} onIonScroll={(ev) => setScrollY(ev.detail.scrollTop)}>
                <OddHeader history={history} scrollY={scrollY}>내 정보</OddHeader>
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
                        <IonLabel>이메일</IonLabel>
                        <IonText>{UserService.currentUser.email}</IonText>
                    </IonItem>
                </IonList>
                    <div className="logout"><OddButton onClick={logout}>로그아웃</OddButton></div>
            </IonContent>
        </IonPage>
    )
}

export default Tab4;