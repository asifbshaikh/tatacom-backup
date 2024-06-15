import React, { useState } from 'react'
import IntlMessages from 'helpers/IntlMessages';
import HTMLCards from './HTMLCards';
import CardContentConfiguration from './CardContentConfiguration';

const CustomHTMLEditor = () => {
    const [isChoose, setIsChoose] = useState(false);
    return (
        <>
            <div>
                <div className='d-flex'>
                    {isChoose ? (<CardContentConfiguration />) : (
                        <HTMLCards title='editTemplate' setIsChoose={setIsChoose} />
                    )}
                    {isChoose ? '' : <HTMLCards title='uploadTemplate' />}
                </div>
                {!isChoose && (
                    <div className='d-flex'>
                        <h6 className='title-of-cards'><IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEMPLATE.EDIT" /></h6>
                        <h6 className='title-of-cards'><IntlMessages id="EMAIL_CONTENT_CONFIGURATION.TEMPLATE.UPLOAD" /></h6>
                    </div>
                )}
            </div>
        </>
    )



}
export default CustomHTMLEditor;