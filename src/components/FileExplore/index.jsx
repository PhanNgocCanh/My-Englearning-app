import React, { createContext, useEffect, useRef, useState } from 'react';
import TreeView from './TreeView';
import { DocumentApi } from '../../api/DocumentApi';

export const DataTreeContext = createContext();

function FileExplore({ lessonId, load, loadFile, selectedDocumentId, handleRemoveOpenDocument }) {
    const [selectedFile, setSelectedFile] = useState();
    const [data, setData] = useState({});
    const [isReloadTree, setIsReloadTree] = useState(false);
    const ref = useRef({});
    useEffect(() => {
        DocumentApi.getTree(lessonId)
            .then(function (res) {
                let tree = {};
                buildTreeData(tree, res.data, res.data.documentNodeId, '');
                if (Object.keys(ref.current).length !== 0) {
                    Object.keys(tree).forEach((documentNodeId) => {
                        if (ref.current[documentNodeId]) {
                            tree[documentNodeId].isOpen = ref.current[documentNodeId].isOpen;
                        }
                    });
                }
                setData(tree);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [isReloadTree]);

    useEffect(() => {
        setIsReloadTree(!isReloadTree);
    }, [load]);

    const buildTreeData = (tree, data, parentRootId, path) => {
        if (data === null) {
            return;
        }
        if (data.parentId != null) {
            path = path + '/' + data.documentNodeName;
        }

        let childrens = [];
        tree[path] = {
            path: path,
            pathDocument: data.path,
            parentId: data.parentId,
            nodeId: data.documentNodeId,
            color: data.color,
            type: data.documentNodeType === 'FOLDER' ? 'folder' : 'file',
            isSelected: selectedDocumentId == data.documentNodeId,
            isRoot: data.parentId === parentRootId,
            lastViewedPage: data.lastViewedPage,
            children: [],
        };
        data.children.forEach((child, index) => {
            if (path !== '') {
                childrens.push(path + '/' + child.documentNodeName);
                tree[path] = {
                    path: path,
                    pathDocument: data.path,
                    parentId: data.parentId,
                    nodeId: data.documentNodeId,
                    color: data.color,
                    type: data.documentNodeType === 'FOLDER' ? 'folder' : 'file',
                    isSelected: selectedDocumentId == data.documentNodeId,
                    isRoot: data.parentId === parentRootId,
                    lastViewedPage: data.lastViewedPage,
                    children: childrens,
                };
            }
            buildTreeData(tree, child, parentRootId, path);
        });
    };

    const reloadTree = () => {
        ref.current = data;
        setIsReloadTree(!isReloadTree);
    };

    const handleSelectFile = (file) => {
        setSelectedFile(file);
        if (file.type == 'file') loadFile(file);
    };

    const handleDeleteDocument = (documentId) => {
        handleDeleteDocument(documentId);
    };

    return (
        <DataTreeContext.Provider value={reloadTree}>
            <div>
                <TreeView
                    onSelectedFile={handleSelectFile}
                    key={1}
                    data={data}
                    selectedNodeId={selectedDocumentId}
                    onDeleteDocument={handleDeleteDocument}
                />
            </div>
        </DataTreeContext.Provider>
    );
}

export default FileExplore;
