import React from 'react';
import './OddModal.scss';

export const OddModal: React.FC< { title: string } > = ({ title, children }) => {
    const backdrop = React.useRef<any>();
    const [ isOpened, setIsOpened ] = React.useState<boolean>(false);
    const onClick = () => {
        backdrop.current.style['transition'] = isOpened?' top 0.2s 0.5s, background-color 0.5s':'top 0.2s, background-color 0.5s 0.2s';
        setIsOpened(!isOpened)
    }

    return (
        <div className={'OddModal backdrop' + (isOpened?' active':'')} ref={backdrop}>
            <div className='container'>
                <div className="handler"></div>
                <h5 onClick={onClick}>{title}</h5>
                {children}
            </div>
        </div>
    )
}