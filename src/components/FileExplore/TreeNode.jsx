import React, { useContext, useState } from 'react';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { DataTreeContext } from '.';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFolder,
    faFolderOpen,
    faChevronDown,
    faChevronRight,
    faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import { faFilePdf, faTimesCircle } from '@fortawesome/free-regular-svg-icons';

import styles from './TreeNode.module.scss';
import useModal from '../../hooks/useModal';
import Modal from '../Modal/Modal';
import { DocumentApi } from '../../api/DocumentApi';
import { DocumentType } from '../../constant/DocumentType';
import { ColorPicker } from '../../constant/Color';
import { Button, Dialog, DialogActions, DialogTitle, Tooltip, Typography } from '@mui/material';

const cx = classNames.bind(styles);

function TreeNode({ node, getChildNode, level, onToggle, onNodeSelect }) {
    const [isCreateNode, setIsCreateNode] = useState(false);
    const [docName, setDocName] = useState('');
    const [documentFile, setDocumentFile] = useState(null);
    const [isOpenConfirm, setIsOpenConfirm] = useState(false);
    const [isUpdateDocument, setIsUpdateDocument] = useState(false);
    const { isShowing, toggle } = useModal();
    const [queryParam, setQueryparam] = useSearchParams();
    const lessonId = queryParam.get('lessonId');
    const reloadContext = useContext(DataTreeContext);
    const getNodeLabel = (node) => {
        let arr = node.path.split('/');
        return arr[arr.length - 1];
    };

    const handleCreateNode = (e) => {
        if (e.key == 'Enter') {
            DocumentApi.create({
                documentName: docName,
                documentType: DocumentType.folder,
                parentId: node.nodeId,
                color: ColorPicker[Math.floor(Math.random() * ColorPicker.length)],
                path: node.path + '/' + docName,
                lessonId: lessonId,
            })
                .then(function (res) {
                    setDocName('');
                    setDocumentFile();
                    setIsCreateNode(false);
                    reloadContext();
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };

    const handleCreateNodeFile = (e) => {
        e.preventDefault();
        toggle();
        if (!isUpdateDocument) {
            let formData = new FormData();
            formData.append('file', documentFile);
            DocumentApi.upload(formData)
                .then(function (res) {
                    createDocumentFile(res);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            DocumentApi.create({
                documentId: node.nodeId,
                documentName: docName,
                documentType: node.type == 'folder' ? DocumentType.folder : DocumentType.file,
                parentId: node.parentId,
                color: node.color,
                path: node.pathDocument,
                lastViewedPage: node.lastViewedPage,
                lessonId: lessonId,
            }).then(function (res) {
                setDocName('');
                setIsUpdateDocument(false);
                toggle();
                reloadContext();
            });
        }
    };

    const createDocumentFile = (path) => {
        DocumentApi.create({
            documentName: docName !== '' ? docName + '.pdf' : documentFile.name,
            documentType: DocumentType.file,
            parentId: node.nodeId,
            color: ColorPicker[Math.floor(Math.random() * ColorPicker.length)],
            path: path,
            lessonId: lessonId,
        })
            .then(function (res) {
                setDocName('');
                setIsCreateNode(false);
                reloadContext();
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleDeleteDocument = (documentId) => {
        DocumentApi.delete(documentId)
            .then(function (res) {
                setIsOpenConfirm(false);
                reloadContext();
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleSetText = () => {
        setIsUpdateDocument(true);
        setDocName(getNodeLabel(node));
        toggle();
    };

    const stylePadding = (20 + level) * level;
    const styleWidth = node.type == 'file' ? 230 - 10 * level : null;

    return (
        <div>
            <div
                className={`node mb-1 p-1 flex justify-between items-center rounded-sm ${
                    node.isSelected ? 'bg-gray-400 bg-opacity-40' : ''
                }`}
                style={{ paddingLeft: stylePadding }}
            >
                <div className={`flex justify-between group/item w-full`}>
                    <div className="flex items-center" onClick={() => onNodeSelect(node)}>
                        <span onClick={() => onToggle(node)}>
                            {node.type === 'folder' &&
                                (node.isOpen ? (
                                    <FontAwesomeIcon className={cx('file-chev')} icon={faChevronDown} />
                                ) : (
                                    <FontAwesomeIcon className={cx('file-chev')} icon={faChevronRight} />
                                ))}
                        </span>
                        {node.type === 'file' && <FontAwesomeIcon className={cx('file-icon')} icon={faFilePdf} />}
                        {node.type === 'folder' && node.isOpen === true && (
                            <FontAwesomeIcon
                                style={{ color: node.color }}
                                className={cx('file-icon')}
                                icon={faFolderOpen}
                            />
                        )}
                        {node.type === 'folder' && !node.isOpen && (
                            <FontAwesomeIcon
                                style={{ color: node.color }}
                                className={cx('file-icon')}
                                icon={faFolder}
                            />
                        )}

                        <div
                            style={{ width: styleWidth }}
                            className={`${node.type == 'file' ? cx('length-text') : ''} ${cx('node-label')}`}
                        >
                            {getNodeLabel(node)}
                        </div>
                    </div>

                    <Tippy
                        interactive
                        hideOnClick={false}
                        placement="left-start"
                        render={(attrs) => (
                            <div className="text-slate-200 w-22 h-22 bg-slate-500 rounded-sm p-1">
                                {node.type === 'folder' ? (
                                    <div>
                                        <p
                                            className=" text-center text-sm hover:bg-slate-800 text-white p-1 rounded-sm hover:cursor-pointer"
                                            onClick={() => setIsCreateNode(true)}
                                        >
                                            New folder
                                        </p>
                                        <p
                                            className="text-sm hover:bg-slate-800 text-white p-1 rounded-sm hover:cursor-pointer"
                                            onClick={toggle}
                                        >
                                            New file
                                        </p>
                                        <p
                                            className="text-sm hover:bg-slate-800 text-white p-1 rounded-sm hover:cursor-pointer"
                                            onClick={handleSetText}
                                        >
                                            Rename
                                        </p>
                                        <p
                                            className="text-sm hover:bg-slate-800 text-white p-1 rounded-sm hover:cursor-pointer"
                                            onClick={() => setIsOpenConfirm(true)}
                                        >
                                            Delete
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <p
                                            className="text-center text-sm hover:bg-slate-800 text-white p-1 rounded-sm hover:cursor-pointer"
                                            onClick={handleSetText}
                                        >
                                            Rename
                                        </p>
                                        <p
                                            className="text-sm hover:bg-slate-800 text-white p-1 rounded-sm hover:cursor-pointer"
                                            onClick={() => setIsOpenConfirm(true)}
                                        >
                                            Delete
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    >
                        <div className={`float-right mr-1 text-sm invisible group-hover/item:visible`}>
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                        </div>
                    </Tippy>
                </div>
            </div>
            {node.type === 'folder' && isCreateNode && (
                <div className="flex justify-between bg-transparent w-full">
                    <p></p>
                    <input
                        className="bg-slate-600 outline-none focus:outline-none rounded-sm p-1 h-5 text-sm"
                        type="text"
                        value={docName}
                        spellCheck={false}
                        autoFocus={isCreateNode}
                        onChange={(e) => setDocName(e.target.value)}
                        onKeyDown={handleCreateNode}
                    />
                    <FontAwesomeIcon icon={faTimesCircle} onClick={() => setIsCreateNode(false)} />
                </div>
            )}
            <Dialog open={isOpenConfirm} onClose={() => setIsOpenConfirm(false)} aria-labelledby="alert-dialog-title">
                <div className="opacity-100 bg-white">
                    <DialogTitle id="alert-dialog-title" className="font-bold text-base text-blue-500">
                        Do you want to delete document ?
                    </DialogTitle>
                    <DialogActions>
                        <Button variant="outlined" onClick={() => setIsOpenConfirm(false)}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={() => handleDeleteDocument(node.nodeId)}>
                            OK
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
            {node.isOpen &&
                getChildNode(node).map((childNode, index) => (
                    <TreeNode
                        key={index}
                        node={childNode}
                        getChildNode={getChildNode}
                        level={level + 1}
                        onToggle={onToggle}
                        onNodeSelect={onNodeSelect}
                    />
                ))}
            {createPortal(
                <Modal
                    isShowing={isShowing}
                    hide={toggle}
                    width={300}
                    height={!isUpdateDocument ? 220 : 160}
                    title={`${isUpdateDocument ? 'Rename document' : 'Upload document'}`}
                >
                    <div
                        className="w-full flex items-center justify-center mt-2 border-[2px] border-slate-400 rounded-full
                    p-1 px-3 mb-5"
                    >
                        <input
                            className="bg-transparent outline-none focus:outline-none w-full text-white"
                            type="text"
                            value={docName}
                            placeholder="Enter your file name"
                            onChange={(e) => setDocName(e.target.value)}
                        />
                    </div>
                    {!isUpdateDocument && (
                        <div className="w-full flex items-center justify-center mb-5">
                            <input
                                className="file:bg-gradient-to-b file:from-blue-500 file:to-blue-600
                        file:px-3 file:py-2 file:m-2
                        file:border-none
                        file:rounded-full
                        file:text-white file:text-sm
                        file:cursor-pointer
                        file:shadow-lg
                        file:shadow-blue-600/50
                        bg-gradient-to-br from-slate-500 to-slate-800
                        text-white/80
                        rounded-full
                        cursor-pointer
                        shadow-xl shadow-gray-700/60"
                                type="file"
                                onChange={(e) => setDocumentFile(e.target.files[0])}
                            />
                        </div>
                    )}
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
                            onClick={handleCreateNodeFile}
                        >
                            {!isUpdateDocument ? 'Create' : 'Save'}
                        </button>
                    </div>
                </Modal>,
                document.body,
            )}
        </div>
    );
}

export default TreeNode;
