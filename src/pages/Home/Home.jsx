import { Navigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

import Card from '../../components/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

import Modal from '../../components/Modal/Modal';
import useModal from '../../hooks/useModal';
import { useEffect, useState } from 'react';
import { CollectionApi } from '../../api/CollectionApi';
import { ToastContainer, toast } from 'react-toastify';

function Home() {
    const { isShowing, toggle } = useModal();
    const [isReloadData, setIsReloadData] = useState(false);
    const [collectionId, setCollectionId] = useState(null);
    const [collections, setCollections] = useState([]);
    const [collectionName, setCollectionName] = useState('');
    const [collectionDescription, setCollectionDescription] = useState('');

    useEffect(() => {
        let response = CollectionApi.getAll({
            keyword: '',
            collectioName: '',
            page: 0,
            size: 20,
        })
            .then(function (res) {
                console.log(res.data.data);
                setCollections(res.data.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [isReloadData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let action = collectionId != null ? 'Edit' : 'Add';
        CollectionApi.create({
            collectionId: collectionId,
            collectionName: collectionName,
            description: collectionDescription,
        })
            .then(function (res) {
                setIsReloadData(!isReloadData);
                setCollectionName('');
                setCollectionDescription('');
                setCollectionId(null);
                toggle();
                toast.success(action + ' new  collection success !');
            })
            .catch(function (error) {
                toast.error(action + ' new  collection failed ! ');
            });
    };

    const handleDeleteCollection = (collectionId) => {
        CollectionApi.delete(collectionId)
            .then(function (error) {
                setIsReloadData(!isReloadData);
                toast.success('Delete collection success !');
            })
            .catch(function (error) {
                toast.error('Delete collection failed !');
            });
    };

    const handleEditCollection = (collection) => {
        setCollectionId(collection.collectionId);
        setCollectionName(collection.collectionName);
        setCollectionDescription(collection.description);
        toggle();
    };

    return (
        <div className="py-2 px-8 bg-slate-800 text-white h-screen overflow-y-auto">
            <div className="flex justify-between items-center">
                <h2 className="my-4 font-bold text-lg">My Collection</h2>
                <div className="flex">
                    <button
                        className="text-sm border-[1px] border-slate-700 bg-transparent py-1 px-2 rounded-sm text-slate-500
                    hover:text-white hover:bg-slate-600 ease-linear duration-500 mr-2"
                        onClick={toggle}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        <span className="ml-1">New</span>
                    </button>
                    <div className="border-[1px] bg-transparent border-slate-700 rounded-sm px-2 focus-within:border-blue-600">
                        <FontAwesomeIcon icon={faSearch} style={{ fontSize: 14, color: 'rgb(100 116 139 / 1)' }} />
                        <input
                            type="text"
                            placeholder="Search by title"
                            className="outline-none bg-transparent h-full focus:outline-none text-sm ml-2 text-slate-200"
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-12 gap-y-6">
                {collections.map((collection, index) => (
                    <Card
                        key={index}
                        data={collection}
                        onEdit={handleEditCollection}
                        onDelete={() => handleDeleteCollection(collection.collectionId)}
                    />
                ))}
            </div>

            {createPortal(
                <Modal isShowing={isShowing} hide={toggle} width={300} title="New collection" height={350}>
                    <div>
                        <form onSubmit={handleSubmit} className="flex justify-between flex-col">
                            <div>
                                <div className="flex flex-col mb-2">
                                    <label className="text-white text-sm mb-1 font-semibold leading-relaxed" htmlFor="">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={collectionName}
                                        placeholder="New collection"
                                        className="bg-transparent outline-none focus:outline-none border-[1px] border-slate-400 p-1 
                                    rounded-sm text-white text-sm focus:border-blue-600"
                                        onChange={(e) => setCollectionName(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col mb-2">
                                    <label className="text-white text-sm mb-1 font-semibold leading-relaxed" htmlFor="">
                                        Description
                                    </label>
                                    <textarea
                                        type="text"
                                        value={collectionDescription}
                                        rows={6}
                                        placeholder="Adding description about your collection"
                                        className="bg-transparent outline-none focus:outline-none border-[1px] border-slate-400 p-1 
                                    rounded-sm text-white text-sm focus:border-blue-600"
                                        onChange={(e) => setCollectionDescription(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="absolute bottom-2 w-full">
                                <div className="flex justify-between w-full">
                                    <button
                                        className="bg-slate-800 text-slate-400 border-[1px] border-slate-500 px-2 py-1 rounded-sm
                                    hover:bg-slate-700 hover:text-slate-200 ease-linear duration-150 text-sm"
                                        onClick={toggle}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-blue-600 text-white text-sm px-2 py-1 rounded-sm hover:bg-opacity-80"
                                        type="submit"
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </Modal>,
                document.body,
            )}
            <ToastContainer autoClose={8000} />
        </div>
    );
}

export default Home;
