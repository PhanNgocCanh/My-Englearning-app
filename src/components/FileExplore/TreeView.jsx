import React, { createRef, useEffect, useState } from 'react';
import TreeNode from './TreeNode';

function TreeView({ onSelectedFile, data, selectedNodeId }) {
    const [nodes, setNodes] = useState(data);
    useEffect(() => {
        setNodes(data);
    }, [data]);

    useEffect(() => {
        if (selectedNodeId != '') {
            let nodeSelected = null;
            for (var n in nodes) {
                if (nodes[n].nodeId == selectedNodeId) {
                    nodeSelected = nodes[n];
                }
                nodes[n].isSelected = false;
            }
            nodeSelected.isSelected = true;
            let nodesCopy = { ...nodes };
            setNodes(nodesCopy);
        }
    }, [selectedNodeId]);

    const getRootNode = () => {
        let obj = {};
        for (var key in nodes) {
            if (nodes[key].isRoot) obj[key] = nodes[key];
        }
        return obj;
    };

    const getChildNode = (node) => {
        if (!node.children) return [];
        return node.children.map((path) => nodes[path]);
    };

    const onToggle = (node) => {
        nodes[node.path].isOpen = !node.isOpen;
        let copy = { ...nodes };
        setNodes(copy);
    };

    const onNodeSelect = (node) => {
        for (var n in nodes) {
            nodes[n].isSelected = false;
        }
        nodes[node.path].isSelected = true;
        let nodesCopy = { ...nodes };
        setNodes(nodesCopy);
        onSelectedFile(node);
    };

    const rootNode = getRootNode();

    const treeNode = [];
    let index = 0;
    for (var node in rootNode) {
        treeNode.push(
            <TreeNode
                key={index++}
                node={nodes[node]}
                getChildNode={getChildNode}
                level={0}
                onToggle={onToggle}
                onNodeSelect={onNodeSelect}
            />,
        );
    }
    return <div>{treeNode}</div>;
}

export default TreeView;
