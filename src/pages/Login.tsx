import React from 'react';
import userService from '../services/user.service';
import "./Login.scss";

import {
    IonPage,
    IonContent,
    IonInput
} from '@ionic/react';

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

    const signup = () => {
        history.push('/signup');
    }

    const id = React.useRef<any>()
    const password = React.useRef<any>()

    return (
        <IonPage className="Login">
            <IonContent>
                <h1>어디대</h1>
                <div className="login-form">
                    <IonInput className="emailInput" ref={id} placeholder="이메일"></IonInput>
                    <IonInput className="passwordInput" type="password" ref={password} placeholder="비밀번호"></IonInput>
                    <div className="buttons">
                        <OddButton onClick={login}>로그인</OddButton>
                        <OddButton onClick={signup}>회원가입</OddButton>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default Login