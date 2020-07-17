import React from 'react';
import './ParkingItem.scss'
import { ParkingLot } from '../models/ParkingLot';

export const ParkingItem: React.FC<{
    item: ParkingLot
}> = ({ item }) => {
    return (
        <div className="parking-lot">
            <img src="https://lh3.googleusercontent.com/proxy/sfFJ2n3aTYB_ne6XTvedW_fUgcGq0KwmCnwnlR0vrLQ05ywFwnRTALy8-bCT37rF6N_pQgya4VcggeSK6WigQdYsIZqZi4fseYQH3A83NxJj1ayf6t8" alt="" className="thumbnail" />
            <div className="content">
                {item.name}
            </div>
        </div>
    )
}