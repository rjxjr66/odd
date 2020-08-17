import React from 'react';
import './OddModal.scss';

export class OddModal extends React.Component< { title: string, color: string, children: any } > {
    isOpened = false;
    backdrop: any = null;
    onClick = () => {
        this.backdrop.current.style['transition'] = this.isOpened?' top 0.2s 0.5s, background-color 0.5s':'top 0.2s, background-color 0.5s 0.2s';
        this.setState(()=>{
            this.isOpened = !this.isOpened;
        });
    }

    constructor(private title: string, private color: string, private children: any) {
        super({ title, color, children });
        this.backdrop = React.createRef();
    }

    render() {
        return (
            <div className={'OddModal backdrop' + (this.isOpened?' active':'')} ref={this.backdrop}>
                <div className={'container' + (this.color=='green'?' green':'')}>
                    <div className="handler"></div>
                    <h5 onClick={this.onClick}>{this.title}</h5>
                    {this.children}
                </div>
            </div>
        )
    }
}