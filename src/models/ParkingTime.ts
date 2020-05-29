export interface ParkingTime {
    id: string
    startDttm: string
    endDttm: string
    parkingLotId: string // FK
}