import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPlus, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { createPortal } from 'react-dom';
import { Button, IconButton, Tooltip } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';

import useModal from '../../hooks/useModal';
import Modal from '../../components/Modal/Modal';
import { LessonApi } from '../../api/LessonApi';
import { createSearchParams, useNavigate } from 'react-router-dom';

function Lesson() {
    const navigate = useNavigate();
    const { isShowing, toggle } = useModal();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [lessons, setLessons] = useState([]);
    const [isReloadData, setIsReloadData] = useState(false);
    const apiRef = useGridApiRef();
    const columns = [
        { field: 'id', headerName: 'No', width: 70 },
        { field: 'lessonName', headerName: 'Title', width: 370, editable: true },
        { field: 'description', headerName: 'Description', width: 500, editable: true },
    ];

    useEffect(() => {
        LessonApi.getAll()
            .then(function (res) {
                res.data.forEach((item, index) => {
                    item.id = index;
                });
                setLessons(res.data);
            })
            .catch(function (error) {
                toast.error('Error while loading data');
            });
    }, [isReloadData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        LessonApi.create({
            lessonName: title,
            description: description,
        })
            .then(function (res) {
                setIsReloadData(!isReloadData);
                setTitle('');
                setDescription('');
                toggle();
                toast.success('Add new lesson success !');
            })
            .catch(function (error) {
                console.log(error);
                toast.error('Add new lesson failed !');
            });
    };

    const handleEditLesson = (newLesson, oldLesson) => {
        if (oldLesson.lessonName === newLesson.lessonName && oldLesson.description === newLesson.description) {
            return;
        }

        const { id, ...newLessonData } = newLesson;

        LessonApi.create(newLessonData)
            .then(function (res) {
                setIsReloadData(!isReloadData);
                toast.success('Update lesson success !');
            })
            .catch(function (error) {
                console.log(error);
                toast.error('Update lesson failed !');
            });
    };

    const handleDeleteLesson = () => {
        const rowSelected = apiRef.current.getSelectedRows();
        let deleteIds = [];
        rowSelected.forEach((item, index) => deleteIds.push(item.lessonId));
        LessonApi.delete(deleteIds)
            .then(function (res) {
                setIsReloadData(!isReloadData);
                toast.success('Delete lesson success !');
            })
            .catch(function (error) {
                console.log(error);
                toast.error('Delete lesson failed !');
            });
    };

    const handelViewLesson = () => {
        const rowSelected = apiRef.current.getSelectedRows();
        if (rowSelected.size != 1) {
            toast.warning('To view select only one lesson !');
            return;
        }
        const lessonId = rowSelected.entries().next().value[1].lessonId;
        navigate({
            pathname: '/lesson/view',
            search: createSearchParams({
                lessonId: lessonId,
            }).toString(),
        });
    };

    return (
        <div className="py-2 px-8 h-screen bg-slate-800 text-white">
            <div className="flex justify-between items-center">
                <h2 className="my-4 font-bold text-lg">My Lesson</h2>
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
            <div className="">
                <div className="px-52 py-6 text-white text-sm">
                    <div className="flex mb-2">
                        <Tooltip title="Select only one lesson to view" placement="top">
                            <div
                                className="w-12 h-8 rounded-md bg-green-400 flex justify-center items-center mr-2"
                                onClick={handelViewLesson}
                            >
                                <FontAwesomeIcon className="text-sm" icon={faEye} />
                            </div>
                        </Tooltip>
                        <Tooltip title="Delete lesson" placement="top">
                            <div
                                className="w-12 h-8 rounded-md bg-red-500 flex justify-center items-center mr-2"
                                onClick={handleDeleteLesson}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </div>
                        </Tooltip>
                        <Tooltip title="Add lesson to collection" placement="top">
                            <div
                                className="w-12 h-8 rounded-md bg-blue-500 flex justify-center items-center"
                                onClick={handleDeleteLesson}
                            >
                                <FontAwesomeIcon className="text-sm" icon={faPlus} />
                            </div>
                        </Tooltip>
                    </div>
                    <DataGrid
                        apiRef={apiRef}
                        rows={lessons}
                        columns={columns}
                        disableRowSelectionOnClick
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10, 20]}
                        checkboxSelection
                        processRowUpdate={handleEditLesson}
                        className="bg-white"
                    />
                </div>
            </div>
            {createPortal(
                <Modal isShowing={isShowing} hide={toggle} width={300} title="New lesson" height={350}>
                    <div>
                        <form onSubmit={handleSubmit} className="flex justify-between flex-col">
                            <div>
                                <div className="flex flex-col mb-2">
                                    <label className="text-white text-sm mb-1 font-semibold leading-relaxed" htmlFor="">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        placeholder="New collection"
                                        className="bg-transparent outline-none focus:outline-none border-[1px] border-slate-400 p-1 
                                    rounded-sm text-white text-sm focus:border-blue-600"
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col mb-2">
                                    <label className="text-white text-sm mb-1 font-semibold leading-relaxed" htmlFor="">
                                        Description
                                    </label>
                                    <textarea
                                        type="text"
                                        value={description}
                                        rows={6}
                                        placeholder="Adding description about your collection"
                                        className="bg-transparent outline-none focus:outline-none border-[1px] border-slate-400 p-1 
                                    rounded-sm text-white text-sm focus:border-blue-600"
                                        onChange={(e) => setDescription(e.target.value)}
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

export default Lesson;
