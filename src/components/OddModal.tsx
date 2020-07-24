import React from 'react';
import './OddModal.scss';

export const OddModal: React.FC = () => {
    const backdrop = React.useRef<any>();
    const [ isOpened, setIsOpened ] = React.useState<boolean>(false);
    const onClick = () => {
        backdrop.current.style['transition'] = isOpened?' top 0.2s 0.5s, background-color 0.5s':'top 0.2s, background-color 0.5s 0.2s';
        setIsOpened(!isOpened)
    }

    return (
        <div className={'OddModal backdrop' + (isOpened?' active':'')} ref={backdrop}>
            <div draggable="true" className='container' onClick={onClick}>
                <div className="handler"></div>
            </div>
        </div>
    )
}