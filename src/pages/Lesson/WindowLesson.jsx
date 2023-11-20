import { useEffect, useState } from 'react';
import TabFile from '../../components/TabFile';
import { DocumentApi } from '../../api/DocumentApi';

function WindowLesson({ openedDocument, selectedDocumentPos, selectedDocumentId, onRemoveOpen }) {
    return (
        <div className="shadow-sm h-[695px]">
            {
                <TabFile
                    fileData={openedDocument}
                    selectedDocumentPos={selectedDocumentPos}
                    selectedDocumentId={selectedDocumentId}
                    onRemoveOpen={onRemoveOpen}
                />
            }
        </div>
    );
}

export default WindowLesson;
