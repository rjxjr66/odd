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

import './Login.scss'
import { personCircleOutline, keyOutline } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import { OddButton } from '../components/OddButton';

const Login: React.FC<RouteComponentProps> = ({ history }) => {
    const login = async () => {
        try {
            await userService.login(id.current.value, password.current.value);
            history.replace('/home');
        } catch (err) {
            alert(err);
        }
    }

    const signin = () => {
        history.push('/signin');
    }

    const id = React.useRef<any>()
    const password = React.useRef<any>()

    return (
        <IonPage className="Login">
            <IonContent>
                <h1>어디대</h1>

                <div className="login-form">
                    <IonInput ref={id} placeholder="이메일"></IonInput>
                    <IonInput type="password" ref={password} placeholder="비밀번호"></IonInput>
                    <div className="buttons">
                        <OddButton onClick={login}>로그인</OddButton>
                        <OddButton onClick={signin}>회원가입</OddButton>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default Login