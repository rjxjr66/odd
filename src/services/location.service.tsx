import * as firebase from 'firebase'
import UserService from './user.service';
import { ParkingLot } from '../models/ParkingLot';
import { BLE } from '@ionic-native/ble';

function stringToBytes(string: string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
     }
     return array.buffer;
 }

class LocationService {
    MAC = 'FC:C7:83:42:73:49';
    UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e"

    constructor() {

    }

    async lock() {
        return new Promise((resolve, reject)=>{
            BLE.connect(this.MAC).subscribe(peripheralData=>{
                console.log(peripheralData)
                BLE.write(this.MAC, '6e400001-b5a3-f393-e0a9-e50e24dcca9e', '6e400002-b5a3-f393-e0a9-e50e24dcca9e', stringToBytes('l'));
                BLE.disconnect(this.MAC)
                resolve()
            });
        });
    }

    async unlock() {
        return new Promise((resolve, reject)=>{
            BLE.connect(this.MAC).subscribe(peripheralData=>{
                console.log(peripheralData)
                BLE.write(this.MAC, '6e400001-b5a3-f393-e0a9-e50e24dcca9e', '6e400002-b5a3-f393-e0a9-e50e24dcca9e', stringToBytes('u'));
                BLE.disconnect(this.MAC)
                resolve()
            });
        });
    }

    async addLocation(info: ParkingLot) {
        return await firebase.firestore().collection('/odd/ZEmHGVHq05UCeQHclQ2u/locations').add({
            ...info,
            userId: UserService.currentUser.id
        })
    }
    
    async searchNearBy(lat: number, lng: number): Promise<ParkingLot[]> {
        const result = await firebase.firestore().collection('/odd/ZEmHGVHq05UCeQHclQ2u/locations')
            .where('lat', '>=', lat - 0.1)
            .where('lat', '<=', lat + 0.1)
            .get();

        const list: ParkingLot[] = [];
        result.forEach((doc) => {
            const item = doc.data();
            if (item.lng >= lng - 0.1 && item.lng <= lng + 0.1) {
                list.push({ ...item, id: doc.id } as ParkingLot);
            }
        });

        return list;
    }

    async searchByKeyword(text: string): Promise<ParkingLot[]> {
        const result = await firebase.firestore().collection('/odd/ZEmHGVHq05UCeQHclQ2u/locations')
            .get();

        const list: ParkingLot[] = [];
        result.forEach((doc) => {
            const item = doc.data();
            if (item.name.includes(text) || item.address.includes(text)) {
                list.push({ ...item, id: doc.id } as ParkingLot);
            }
        });

        return list;
    }

    async getMyLocation() {
        const result = await firebase.firestore().collection('/odd/ZEmHGVHq05UCeQHclQ2u/locations')
            .where('userId', '==', UserService.currentUser.id)
            .get();

        const list: ParkingLot[] = [];
        result.forEach((doc) => {
            const item = doc.data();
            list.push({ ...item, id: doc.id } as ParkingLot);
        });

        return list;
    }

    async getMyReservation() {
        const result = await firebase.firestore().collection('/odd/ZEmHGVHq05UCeQHclQ2u/book')
        .where('userId', '==', UserService.currentUser.id)
        .get()

        const list: ParkingLot[] = [];
        result.forEach(async _=>{
            list.push(await this.getInfo(_.data().parkingLotId))
        })

        console.log(list)

        return list;
    }

    async getInfo(id: string) {
        const result = await firebase.firestore().doc(`/odd/ZEmHGVHq05UCeQHclQ2u/locations/${id}`)
            .get()

        return { id, ...result.data() } as ParkingLot;
    }

    async book(id: string) {
        const result = await firebase.firestore().collection('/odd/ZEmHGVHq05UCeQHclQ2u/book')
            .add({
                userId: UserService.currentUser.id,
                parkingLotId: id
            })
    }

    async cancel(id: string) {
        const result = await firebase.firestore().collection('/odd/ZEmHGVHq05UCeQHclQ2u/book')
            .where('userId', '==', UserService.currentUser.id)
            .where('parkingLotId', '==', id)
            .get()

        result.forEach(async _=>{
            await firebase.firestore().collection('/odd/ZEmHGVHq05UCeQHclQ2u/book').doc(_.id).delete()
        })
    }

    async delete(id: string) {
        const result = await firebase.firestore().doc(`/odd/ZEmHGVHq05UCeQHclQ2u/locations/${id}`)
            .delete()
    }
}

export default new LocationService();