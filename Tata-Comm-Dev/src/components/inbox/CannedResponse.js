import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import {
    Nav,
    NavItem,
    // Alert,
} from 'reactstrap';

import { NavLink } from 'react-router-dom';


import { getCanneds } from 'redux/actions';
import { listenForOutsideClicks } from 'helpers/TringReactHelper';

const SendMessage = ({
    showMentions, setShowMentions,
    mentionSearchKey,
    replaceText,
    canneds, getCannedsAction,
}) => {
    const menuRef = useRef(null);
    const [listening, setListening] = useState(false);
    // const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        // if (!canneds || !canneds.length) {
        getCannedsAction({ search: mentionSearchKey });
        // }
    }, [mentionSearchKey])

    const toggle = (status) => {
        setShowMentions(status)
        return false;
    };
    useEffect(listenForOutsideClicks(
        listening,
        setListening,
        menuRef,
        toggle,
    ));


    // const toggle = () => setIsOpen(!isOpen);

    return (
        <>
            <div ref={menuRef}>
                {/* <div className='p-2 border color-light' ref={menuRef}> */}
                {/* <div className="chat-input-container1 d-flex justify-content-between align-items-center"> */}
                <Nav className="p-2 mb-0 position-absolute l-0 bg-white mt-5">
                    {canneds.map((item) => {
                        // if (!item.short_code.startsWith(mentionSearchKey) && !item.content.startsWith(mentionSearchKey)) {
                        //     return false;
                        // }
                        return <NavItem key={`canneditm_${item.id}`}>
                            <NavLink
                                to="#"
                                onClick={() => {
                                    setShowMentions(!showMentions);
                                    replaceText(item.content);
                                    return false;
                                }}
                            >
                                {`${item.short_code} - ${item.content}`}
                            </NavLink>
                        </NavItem>
                    })}
                </Nav>
                {/* </div> */}
                {/* </div> */}
            </div>
        </>
    );
};
// export default React.memo(SendMessage);
const mapStateToProps = ({ cannedsApp }) => {
    const { canneds } = cannedsApp;
    return { canneds };
};
export default connect(mapStateToProps, {
    getCannedsAction: getCanneds,
})(SendMessage);