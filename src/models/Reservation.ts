export interface Reservation {
    id: string
    state: ReservationState
    userId: string // FK
    parkingTimeId: string // FK
}

export enum ReservationState {
    RESERVED,
    CANCELED,
    DONE
}