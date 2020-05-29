import * as firebase from 'firebase'
import UserService from './user.service';
import { ParkingLot } from '../models/ParkingLot';

class LocationService {
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

    async getInfo(id: string) {
        const result = await firebase.firestore().doc(`/odd/ZEmHGVHq05UCeQHclQ2u/locations/${id}`)
            .get()

        return { id, ...result.data() } as ParkingLot;
    }
}

export default new LocationService();