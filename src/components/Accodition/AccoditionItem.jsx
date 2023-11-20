import { useState } from 'react';
import { faCaretDown, faCaretRight, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function AccoditionItem({ scrollItem, renderHeader, children }) {
    const styleItem = {
        overflowY: scrollItem ? 'scroll' : 'auto',
    };
    const [isActive, setIsActive] = useState(false);

    const handleToggleActive = () => {
        setIsActive(!isActive);
    };
    return (
        <div
            className={`bg-transparent p-1 mb-1 border border-slate-600 rounded-sm w-full shadow-md ease-in duration-700 group
        ${isActive ? 'is-active' : ''}`}
            style={styleItem}
        >
            <div className={`flex items-center justify-between bg-slate-700 p-1 rounded-sm ${isActive ? 'mb-1' : ''}`}>
                {renderHeader}
                {isActive ? (
                    <FontAwesomeIcon
                        icon={faCaretUp}
                        onClick={handleToggleActive}
                        style={{ transitionDuration: 500, padding: 4 }}
                    />
                ) : (
                    <FontAwesomeIcon
                        icon={faCaretDown}
                        onClick={handleToggleActive}
                        style={{ transitionDuration: 500, padding: 4 }}
                    />
                )}
            </div>
            <div className="overflow-y-scroll px-1 pe-1 duration-700 max-h-0 group-[.is-active]:min-h-[600px]">
                {children}
            </div>
        </div>
    );
}

export default AccoditionItem;
