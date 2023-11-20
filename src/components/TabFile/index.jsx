import { Box, Tab, Tabs } from '@mui/material';
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import CustomTabPanel from './CustomTabPanel';

import styles from './TabFile.module.scss';
import WebViewer, { Core } from '@pdftron/webviewer';
import { DocumentApi } from '../../api/DocumentApi';
import { ToastContainer, toast } from 'react-toastify';

const cx = classNames.bind(styles);

function TabFile({ fileData, selectedDocumentPos, selectedDocumentId, onRemoveOpen }) {
    const [tabIndex, setTabIndex] = useState(selectedDocumentPos);
    const [isReloadView, setIsReloadVIew] = useState(false);
    const viewerDiv = useRef(null);
    const instanceRef = useRef(null);

    useEffect(() => {
        WebViewer(
            {
                path: '../lib',
                licenseKey: 'demo:1692414922414:7c2c0f7703000000005dd2411bb1679ee69d345228d7dae3e562fd3bae',
            },
            viewerDiv.current,
        ).then((instance) => {
            instance.UI.setZoomLevel(1);
            const blob = new Blob([new Uint8Array(fileData[tabIndex].data)], { type: 'application/pdf' });
            instance.UI.loadDocument(blob, { filename: 'myFile.pdf', extension: 'pdf' });
            const { documentViewer, annotationManager } = instance.Core;
            instance.UI.setHeaderItems((headers) => {
                headers.push({
                    type: 'actionButton',
                    img: 'icon-header-zoom-in-line',
                    title: 'Save file',
                    onClick: async function () {
                        const doc = documentViewer.getDocument();
                        const xfdfString = await annotationManager.exportAnnotations();
                        const data = await doc.getFileData({
                            // save document with anotation in it
                            xfdfString,
                        });
                        const arr = new Uint8Array(data);
                        const blob = new Blob([arr], { type: 'application / pdf' });

                        const formData = new FormData();
                        formData.append('file', blob);
                        formData.append('documentId', fileData[tabIndex].documentId);
                        formData.append('lastViewedPage', documentViewer.getCurrentPage());
                        DocumentApi.saveReplace(formData)
                            .then(function (res) {
                                getFileDocument(fileData[tabIndex].documentId);
                                fileData[tabIndex].lastViewedPage = documentViewer.getCurrentPage();
                                toast.success('Save file successfully !');
                            })
                            .catch(function (error) {
                                console.log(error);
                                toast.error('Save file failed !');
                            });
                    },
                });
            });

            documentViewer.addEventListener('documentLoaded', () => {
                documentViewer.zoomTo(1);
                documentViewer.setCurrentPage(fileData[tabIndex].lastViewedPage);
            });
            documentViewer.addEventListener('pageNumberUpdated', (pageNumber) => {
                fileData[tabIndex].lastViewedPage = pageNumber;
            });
            instanceRef.current = instance;
        });
    }, [tabIndex]);

    const getFileDocument = async (documentId) => {
        const response = DocumentApi.download(documentId)
            .then(function (res) {
                fileData[tabIndex].data = res;
                setIsReloadVIew(!isReloadView);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    useEffect(() => {
        if (instanceRef.current) {
            const blob = new Blob([new Uint8Array(fileData[tabIndex].data)], { type: 'application/pdf' });
            instanceRef.current.UI.loadDocument(blob, { filename: 'myFile.pdf', extension: 'pdf' });
        }
    }, [fileData[tabIndex].documentId, isReloadView]);

    useEffect(() => {
        setTabIndex(selectedDocumentPos);
    }, [selectedDocumentPos]);

    const handleChangeTab = (event, newIndex) => {
        setTabIndex(newIndex);
        selectedDocumentId(fileData[newIndex].documentId);
    };

    const crerateTabInfo = (index) => {
        return {
            id: `tab-${index}`,
            'aria-controls': `tabpanel-${index}`,
        };
    };

    return (
        <Box sx={{ width: '100%' }} className="h-full">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="shadow-md rounded-sm">
                <Tabs
                    value={tabIndex}
                    variant="scrollable"
                    scrollButtons="auto"
                    onChange={handleChangeTab}
                    className="h-2 flex items-center bg-slate-800"
                >
                    {fileData.map((item, index) => (
                        <Tab
                            className={`normal-case text-blue-200 min-w-[120px] p-0 px-1 ${
                                tabIndex === item.index ? 'font-bold' : ''
                            }`}
                            key={index}
                            label={`${item.documentName}`}
                            onDoubleClick={() => {
                                onRemoveOpen(item.documentId);
                                if (tabIndex > 0) {
                                    setTabIndex(tabIndex - 1);
                                }
                            }}
                            {...crerateTabInfo(index)}
                        />
                    ))}
                </Tabs>
            </Box>
            <div className="h-full">
                {fileData.map((item, index) => (
                    <CustomTabPanel key={index} value={tabIndex} index={index}>
                        <div className="webviewer w-full h-full" ref={viewerDiv}>
                            <div></div>
                        </div>
                    </CustomTabPanel>
                ))}
            </div>
            <ToastContainer autoClose={8000} />
        </Box>
    );
}

export default TabFile;
