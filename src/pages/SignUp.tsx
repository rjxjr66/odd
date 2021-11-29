import React from 'react';
import { IonPage, IonItem, IonLabel, IonIcon, IonInput, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle } from '@ionic/react';
import './SignUp.scss'
import { personCircleOutline, keyOutline, pricetagOutline, callOutline, carOutline } from 'ionicons/icons';

import { RouteComponentProps } from 'react-router';

import userService from '../services/user.service';
import { OddButton } from '../components/OddButton';

const SignUp: React.FC<RouteComponentProps> = ({ history }) => {
    const email = React.useRef<any>();
    const password = React.useRef<any>();
    const passwordRepeat = React.useRef<any>();
    const name = React.useRef<any>();
    const tel = React.useRef<any>();
    const carNumber = React.useRef<any>();

    const signup = async ()=>{
        if (password.current.value !== passwordRepeat.current.value) {
            alert("비밀번호와 비밀번호 확인이 다릅니다.")
        } else {
            try {
                await userService.signUp(email.current.value, password.current.value, name.current.value, tel.current.value, carNumber.current.value)

                history.replace('/home');
            } catch(err) {
                alert(err);
            }
            
        }
    }

    return (
        <IonPage className="SignUp">
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/login" />
                    </IonButtons>
                    <IonTitle>회원가입</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonItem>
                    <IonLabel>
                        <IonIcon icon={personCircleOutline}></IonIcon>
                    </IonLabel>
                    <IonInput ref={email} placeholder="이메일"></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel>
                        <IonIcon icon={keyOutline}></IonIcon>
                    </IonLabel>
                    <IonInput ref={password} type="password" placeholder="비밀번호"></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel>
                        <IonIcon icon={keyOutline}></IonIcon>
                    </IonLabel>
                    <IonInput ref={passwordRepeat} type="password" placeholder="비밀번호 확인"></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel>
                        <IonIcon icon={pricetagOutline}></IonIcon>
                    </IonLabel>
                    <IonInput ref={name} placeholder="이름"></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel>
                        <IonIcon icon={callOutline}></IonIcon>
                    </IonLabel>
                    <IonInput ref={tel} placeholder="전화번호"></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel>
                        <IonIcon icon={carOutline}></IonIcon>
                    </IonLabel>
                    <IonInput ref={carNumber} placeholder="차량번호"></IonInput>
                </IonItem>
                <div className="buttons">
                    <OddButton onClick={signup}>회원가입</OddButton>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default SignUp