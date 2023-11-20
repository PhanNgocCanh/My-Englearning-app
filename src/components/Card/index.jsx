import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faEdit, faEllipsisVertical, faPenAlt } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react/headless';

function Card({ data, onEdit, onDelete }) {
    const created_date = new Date(data.createdDate * 1000);
    let date = created_date.getDate() + '/' + created_date.getMonth() + '/' + created_date.getFullYear();

    return (
        <div className="w-full h-28 min-h-full bg-slate-600 text-white rounded-sm py-2 px-4 grid grid-rows-3 gap-y-2">
            <div className="flex justify-between items-center">
                <p className="title font-semibold flex-1 ">{data.collectionName}</p>
                <Tippy
                    interactive
                    hideOnClick={false}
                    placement="left-start"
                    render={(attrs) => (
                        <div className="w-20 h-14 bg-slate-800 rounded-sm shadow-md px-2 py-1">
                            <a
                                className="flex items-center justify-start text-yellow-400 hover:cursor-pointer"
                                onClick={() => onEdit(data)}
                            >
                                <FontAwesomeIcon icon={faEdit} style={{ fontSize: 12 }} />
                                <p className="text-sm ml-2">Edit</p>
                            </a>
                            <a
                                className="flex items-center justify-start text-rose-600 mt-2 hover:cursor-pointer"
                                onClick={onDelete}
                            >
                                <FontAwesomeIcon icon={faTrashAlt} style={{ fontSize: 12 }} />
                                <p className="text-sm ml-2">Delete</p>
                            </a>
                        </div>
                    )}
                >
                    <FontAwesomeIcon icon={faEllipsisVertical} style={{ outline: 'none', padding: '4px' }} />
                </Tippy>
            </div>
            <div className="flex items-center justify-between">
                <p className="text-sm">{data.description}</p>
            </div>
            <div className="flex items-center justify-between">
                <p className="text-sm">Number lesson: {data.totalDocuments}</p>
                <span className="text-sm ml-1" style={{ fontSize: 12 }}>
                    Created date: {date}
                </span>
            </div>
        </div>
    );
}

export default Card;
