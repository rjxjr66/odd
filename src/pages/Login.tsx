import React from 'react';
import userService from '../services/user.service';

import {
    IonIcon,
    IonLabel,
    IonPage,
    IonContent,
    IonItem,
    IonInput,
    IonButton
} from '@ionic/react';

import './Login.css'
import { personCircleOutline, keyOutline } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';

const Login: React.FC<RouteComponentProps> = ( { history } )=>{
    const login = async () => {
        try {
            await userService.login(id.current.value, password.current.value);
            history.replace('/home');
        } catch(err) {
            alert(err);
        }
    }

    const id = React.useRef<any>()
    const password = React.useRef<any>()

    return (
        <IonPage>
            <IonContent>
                <h1>로그인</h1>

                <IonItem>
                    <IonLabel>
                        <IonIcon icon={personCircleOutline}></IonIcon>
                    </IonLabel>
                    <IonInput ref={id} placeholder="이메일"></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel>
                        <IonIcon icon={keyOutline}></IonIcon>
                    </IonLabel>
                    <IonInput type="password" ref={password} placeholder="비밀번호"></IonInput>
                </IonItem>
                <div className="buttons">
                    <IonButton expand="full" onClick={login}>로그인</IonButton>
                    <IonButton routerLink="signin" expand="full" color="light">회원가입</IonButton>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default Login