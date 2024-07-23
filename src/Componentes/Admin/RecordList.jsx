import React, { useState } from 'react';
import Modal from 'react-modal';
import RecordForm from './RecordForm';
import { Link } from "react-router-dom";
import './style.css';

const RecordList = ({ records, deleteRecord, setEditRecord, fetchRecords }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const openCreateModal = () => {
    setSelectedRecord(null);
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const openEditModal = (record) => {
    setSelectedRecord(record);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedRecord(null);
    setIsEditModalOpen(false);
  };

  const openDeleteModal = (record) => {
    setRecordToDelete(record);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setRecordToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = () => {
    deleteRecord(recordToDelete.id);
    closeDeleteModal();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA', options); // 'en-CA' gives the format YYYY-MM-DD
  };

  const imageUrlBase = 'https://back-end-siveth-g8vc.vercel.app/public/images/';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex space-x-4 justify-center">
                <Link
                  to="/admin/records"
                  className="text-black hover:bg-blue-700 px-3 py-2 rounded"
                >
                  Destinos
                </Link>
                <Link
                  to="/admin/Slider"
                  className="text-black hover:bg-blue-700 px-3 py-2 rounded"
                >
                  Slider
                </Link>
                <Link
                  to="/admin/Destinos"
                  className="text-black hover:bg-blue-700 px-3 py-2 rounded"
                >
                  Salidas
                </Link>
                </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Destinos</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={openCreateModal}
        >
          Agregar Nuevo
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4">Titulo</th>
              <th className="py-2 px-4">Imagen</th>
              <th className="py-2 px-4">Descripcion</th>
              <th className="py-2 px-4">Fecha</th>
              <th className="py-2 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-t">
                <td className="py-2 px-4 max-w-xs">{record.title}</td>
                <td className="py-2 px-4">
                  <img src={`${imageUrlBase}${record.image}`} alt={record.title} className="h-16 w-16 object-cover" />
                </td>
                <td className="py-2 px-4 max-w-xs">
                  <div className="truncate">{record.description}</div>
                </td>
                <td className="py-2 px-4 max-w-xs">{formatDate(record.date)}</td>
                <td className="py-2 px-4 flex justify-around items-center">
                  <button
                    className="bg-orange-400 text-white px-4 py-2 rounded mr-2"
                    onClick={() => openEditModal(record)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => openDeleteModal(record)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={closeCreateModal}
        contentLabel="Create Record"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <button onClick={closeCreateModal} className="modal-close-button">×</button>
        <RecordForm fetchRecords={fetchRecords} onClose={closeCreateModal} />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Record"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <button onClick={closeEditModal} className="modal-close-button">×</button>
        {selectedRecord && (
          <RecordForm
            fetchRecords={fetchRecords}
            record={selectedRecord}
            onClose={closeEditModal}
            currentImageUrl={`${imageUrlBase}${selectedRecord.image}`}
          />
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Confirm Delete"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <button onClick={closeDeleteModal} className="modal-close-button">×</button>
        <p>Are you sure you want to delete this record?</p>
        <button onClick={confirmDelete} className="bg-red-500 text-white px-4 py-2 rounded mt-4">
          Yes, Delete
        </button>
        <button onClick={closeDeleteModal} className="bg-gray-500 text-white px-4 py-2 rounded mt-4">
          No, Cancel
        </button>
      </Modal>
    </div>
  );
};

export default RecordList;
