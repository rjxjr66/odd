import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import './OddHeader.scss'

interface Props {
    scrollY: number;
    history: any;
}

export const OddHeader: React.FC<Props> = ({ children, scrollY, history }) => {
    const content = React.useRef<any>();
    const h3 = React.useRef<any>();
    const dummy = React.useRef<any>();
    if (content.current) {
        content.current.style['min-height'] = `${Math.max(200 - scrollY, 62)}px`
        h3.current.style['font-size'] = `${Math.max(40 - scrollY / 8, 28)}px`;
    }

    return (
        <header>
            <div className="content" ref={content}>
            <IonButton onClick={()=>history.goBack()} color="light" fill="clear"><IonIcon slot="icon-only" icon={arrowBack}></IonIcon></IonButton>
            <h3 ref={h3}>{children}</h3>
            </div>
            <div className="dummy" ref={dummy}></div>
        </header>
    );
}