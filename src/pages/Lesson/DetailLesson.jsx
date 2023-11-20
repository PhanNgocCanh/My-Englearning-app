import { createPortal } from 'react-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileCirclePlus,
    faFolderPlus,
    faLightbulb,
    faPhotoVideo,
    faRefresh,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { faClipboard, faIdCard } from '@fortawesome/free-regular-svg-icons';
import { useSearchParams } from 'react-router-dom';

import styles from './Lesson.module.scss';
import Accordition from '../../components/Accodition';
import AccoditionItem from '../../components/Accodition/AccoditionItem';
import FileExplore from '../../components/FileExplore';
import useModal from '../../hooks/useModal';
import Modal from '../../components/Modal/Modal';
import { DocumentApi } from '../../api/DocumentApi';
import { DocumentType } from '../../constant/DocumentType';
import { ColorPicker } from '../../constant/Color';
import WindowLesson from './WindowLesson';
import { Tooltip } from '@mui/material';

const cx = classNames.bind(styles);

function DetailLesson() {
    const [folderName, setFolderName] = useState('');
    const [selectedDocumentPos, setSelectedDocumentPos] = useState(0);
    const [selectedDocumentId, setSelectedDocumentId] = useState('');
    const [openDocument, setOpenDocument] = useState([]);
    const [openId, setOpenId] = useState([]);
    const [queryParam, setQueryparam] = useSearchParams();
    const { isShowing, toggle } = useModal();
    const [reload, setIsReload] = useState(false);
    const lessonId = queryParam.get('lessonId');

    const handleCreateFolder = (e) => {
        e.preventDefault();
        DocumentApi.create({
            documentName: folderName,
            documentType: DocumentType.folder,
            color: ColorPicker[Math.floor(Math.random() * ColorPicker.length)],
            lessonId: lessonId,
        })
            .then(function (res) {
                setIsReload(!reload);
                setFolderName('');
                toggle();
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleLoadDocumentFile = (file) => {
        const path = file.path.split('/');

        if (!openId.find((documentId) => documentId == file.nodeId)) {
            DocumentApi.download(file.nodeId)
                .then(function (res) {
                    setOpenDocument([
                        ...openDocument,
                        {
                            index: openDocument.length,
                            documentId: file.nodeId,
                            documentName: path[path.length - 1],
                            lastViewedPage: file.lastViewedPage,
                            data: res,
                        },
                    ]);
                    setOpenId([...openId, file.nodeId]);
                    setSelectedDocumentPos(openId.length);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            const selectedDocument = openDocument.find((document) => document.documentId == file.nodeId);
            if (selectedDocument) setSelectedDocumentPos(selectedDocument.index);
        }
    };

    const handleChangeSelectDoc = (documentId) => {
        setSelectedDocumentId(documentId);
    };

    const handleRemoveOpenDocument = (documentId) => {
        console.log(documentId);
        const copyDocument = openDocument.filter((item) => item.documentId != documentId);
        const copyOpenDocumentId = openId.filter((item) => item != documentId);
        console.log(copyOpenDocumentId);
        setOpenDocument(copyDocument);
        setOpenId(copyOpenDocumentId);
    };

    return (
        <div className="grid grid-cols-4 gap-2 py-2 px-2 bg-slate-800 text-white">
            <div className="bg-slate-900 h-screen rounded-sm ps-1">
                <Accordition>
                    <AccoditionItem
                        renderHeader={
                            <div className="flex-1 flex justify-between pe-2">
                                <p className="text-emerald-400">
                                    <FontAwesomeIcon className="mr-2 text-emerald-400" icon={faIdCard} />
                                    My document
                                </p>
                                <div>
                                    <Tooltip title="Create root folder">
                                        <FontAwesomeIcon
                                            className={`text-orange-600 ${cx('action-icon')}`}
                                            icon={faFileCirclePlus}
                                            onClick={() => toggle()}
                                        />
                                    </Tooltip>
                                    <Tooltip
                                        title={
                                            <div className="whitespace-pre-line" style={{ whiteSpace: 'pre-line' }}>
                                                <p>Note for you:</p>
                                                <p>- Double click on tab bar to close tab.</p>
                                                <p>- Click the rounded plus icon on the right document to save file.</p>
                                            </div>
                                        }
                                    >
                                        <FontAwesomeIcon
                                            className={`text-yellow-300 ${cx('action-icon')}`}
                                            icon={faLightbulb}
                                        />
                                    </Tooltip>
                                    <FontAwesomeIcon
                                        className={`text-blue-500 ${cx('action-icon')}`}
                                        icon={faRefresh}
                                    />
                                </div>
                            </div>
                        }
                    >
                        <FileExplore
                            lessonId={lessonId}
                            load={reload}
                            loadFile={handleLoadDocumentFile}
                            selectedDocumentId={selectedDocumentId}
                            handleRemoveOpenDocument={handleRemoveOpenDocument}
                        />
                    </AccoditionItem>
                    <AccoditionItem
                        renderHeader={
                            <p className="text-teal-400">
                                <FontAwesomeIcon className="mr-2" icon={faPhotoVideo} />
                                My video
                            </p>
                        }
                    />
                    <AccoditionItem
                        renderHeader={
                            <p className="text-indigo-500">
                                <FontAwesomeIcon className="mr-2" icon={faClipboard} />
                                My video
                            </p>
                        }
                    />
                </Accordition>
            </div>
            <div className="col-span-3 bg-slate-600">
                {openDocument.length > 0 && (
                    <WindowLesson
                        openedDocument={openDocument}
                        selectedDocumentPos={selectedDocumentPos}
                        selectedDocumentId={handleChangeSelectDoc}
                        onRemoveOpen={handleRemoveOpenDocument}
                    />
                )}
            </div>
            {createPortal(
                <Modal isShowing={isShowing} hide={toggle} width={300} height={150} title="Create root folder">
                    <div
                        className="w-full flex items-center justify-center mt-2 border-[2px] border-slate-400 rounded-full
                    p-1 px-3 mb-5"
                    >
                        <input
                            className="bg-transparent outline-none focus:outline-none w-full text-white"
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            placeholder="Enter your folder name"
                        />
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <button
                            className="bg-slate-800 text-slate-400 border-[1px] border-slate-500 px-2 py-1 rounded-sm
                                    hover:bg-slate-700 hover:text-slate-200 ease-linear duration-150 text-sm"
                            onClick={toggle}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-blue-600 text-white text-sm px-2 py-1 rounded-sm hover:bg-opacity-80"
                            onClick={handleCreateFolder}
                        >
                            Create
                        </button>
                    </div>
                </Modal>,
                document.body,
            )}
        </div>
    );
}

export default DetailLesson;
