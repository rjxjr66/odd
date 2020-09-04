import React from 'react';
import { IonButton, IonList, IonItem, IonLabel, IonInput, IonItemGroup, IonItemDivider, IonDatetime } from '@ionic/react';
import LocationService from '../services/location.service';
import './AddLocation.scss'
import { OddButton } from '../components/OddButton';

declare const daum: any;
declare const kakao: any;

export const AddLocation: React.FC<{ onDone: () => void }> = ({ onDone }) => {
    const [address, setAddress] = React.useState<any>({
        value: '',
        showPostcode: false
    });
    const [name, setName] = React.useState<string>('');
    const detailAddress = React.useRef<any>();
    const price = React.useRef<any>();
    const startDttm = React.useRef<any>();
    const endDttm = React.useRef<any>();
    const layer = React.useRef<any>();

    const searchAddress = () => {
        setAddress({
            showPostcode: true,
            value: address.value
        });
        new daum.Postcode({
            oncomplete: (data: any) => {
                setAddress({
                    showPostcode: false,
                    value: data.address
                });
            },
            width: '100vw'
        }).embed(layer.current);
    }

    const addLocation = () => {
        let geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(address.value, async (data: any) => {
            if (data.length > 0) {
                await LocationService.addLocation({
                    name,
                    address: address.value + ' ' + detailAddress.current.value,
                    lat: parseFloat(data[0].y),
                    lng: parseFloat(data[0].x),
                    pricePerUnit: price.current.value,
                    startDttm: startDttm.current.value,
                    endDttm: endDttm.current.value
                });

                onDone();
            }
        })
    }

    return (
        <div className="AddLocation">
            <div ref={layer} className='postcode'></div>
            {!address.showPostcode ? (<IonList>
                <IonItemGroup>
                    <IonInput value={name} onIonChange={(e: any) => setName(e.target.value)} placeholder="주차장 이름을 입력하세요.."></IonInput>
                    <IonItem>
                        <IonLabel>
                            주소
                                {address.value ? (<p>{address.value}</p>) : null}
                        </IonLabel>
                        <OddButton onClick={searchAddress}>검색</OddButton>
                    </IonItem>
                    {address ? (
                        <IonInput ref={detailAddress} placeholder="상세주소를 입력하세요.."></IonInput>
                    ) : null}
                    <IonInput ref={price} placeholder="10분 당 가격을 입력하세요.." type="number"></IonInput>
                </IonItemGroup>
                <IonItemGroup>
                    <IonItemDivider>
                        <IonLabel>주차가능시간</IonLabel>
                    </IonItemDivider>
                    <IonItem>
                        <IonDatetime ref={startDttm} displayFormat="h:mm a" placeholder="시작 시간을 입력하세요.." ></IonDatetime>
                    </IonItem>
                    <IonItem>
                        <IonDatetime ref={endDttm} displayFormat="h:mm a" placeholder="종료 시간을 입력하세요.." ></IonDatetime>
                    </IonItem>
                </IonItemGroup>
            </IonList>) : null}
            <OddButton onClick={addLocation}>등록</OddButton>
        </div>
    )
};