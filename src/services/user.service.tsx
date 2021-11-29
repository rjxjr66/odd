import { User } from "../models/User";
import * as firebase from 'firebase';

class UserService {
    currentUser: User = {};

    async login(email: string, password: string) {
        const result = await firebase.auth().signInWithEmailAndPassword(email, password);
        await this.setUser((result.user as firebase.User).uid);
    }

    async setUser(uid: string) {
        const querySnapshot = await firebase.firestore().collection('/odd/QsSwHKZq2imOJUpVY7dS/users')
            .where('id', '==', uid).get();

        if (querySnapshot.size == 1) {
            querySnapshot.forEach(user => {
                this.currentUser = user.data();
            });
        } else {
            throw 'Not exist';
        }
    }

    async logout() {
        await firebase.auth().signOut();
    }

    async signUp(email: string, password: string, name: string, tel: string, carNumber: string) {
        const result = await firebase.auth().createUserWithEmailAndPassword(
            email,
            password
        );

        await firebase.firestore().collection('/odd/QsSwHKZq2imOJUpVY7dS/users').add({
            id: result.user?.uid,
            email,
            name,
            tel,
            carNumber
        });

        this.currentUser = {
            id: result.user?.uid,
            email,
            name,
            tel,
            carNumber
        }
    }

    getId() {
        return this.currentUser.id
    }
}

export default new UserService();