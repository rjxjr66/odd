import * as firebase from 'firebase'
import UserService from './user.service';
import { ParkingLot } from '../models/ParkingLot';
import { BLE } from '@ionic-native/ble';

class LocationService {
    SERVICE_UUID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';

    constructor() {

    }

    async lock() {
        BLE.scan([], 5)
        .subscribe(console.log)
    }

    async unlock() {
        //
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