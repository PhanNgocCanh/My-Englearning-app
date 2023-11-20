import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

function Modal({ isShowing, hide, width, height, children, ...props }) {
    const modalStyles = {
        width: width,
        height: height,
    };

    const { title } = props;

    const handleClose = (e) => {
        if (e.target.id == 'wrapper') hide();
    };

    return (
        <div
            className={`fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center 
            justify-center ease-in-out duration-500 z-50 shadow-md
        ${isShowing ? 'visible' : 'invisible'}
        `}
            onClick={handleClose}
            id="wrapper"
        >
            <div className="flex flex-col bg-slate-700 rounded-sm py-2 px-4" style={modalStyles}>
                <div className="flex justify-between">
                    <p className="font-bold  line-clamp-1 text-white">{title}</p>
                    <button
                        className="py-1 px-3 rounded-full outline-none focus:outline-none hover:bg-slate-600 text-white"
                        onClick={hide}
                    >
                        <FontAwesomeIcon icon={faClose} />
                    </button>
                </div>
                <div className="modal-content flex-1 relative">{children}</div>
            </div>
        </div>
    );
}

export default Modal;
