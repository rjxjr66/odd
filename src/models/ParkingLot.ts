export interface ParkingLot {
    id?: string;
    name: string
    address: string
    nParkingLot?: number;
    lat?: number;
    lng?: number;
    pricePerUnit: number;
    userId?: string;
    startDttm: string;
    endDttm: string;
}