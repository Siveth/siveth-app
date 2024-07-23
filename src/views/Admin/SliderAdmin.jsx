import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecordForm from '../../Componentes/Admin/RecordForm';
import SliderList from '../../Componentes/Admin/SliderList';

const SliderAdmin = () => {
  const [records, setRecords] = useState([]);
  const [editRecord, setEditRecord] = useState(null);

  const fetchRecords = async () => {
    try {
      const response = await axios.get('https://back-end-siveth-g8vc.vercel.app/api/slider');
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching records', error);
    }
  };

  const deleteRecord = async (id) => {
    try {
      await axios.delete(`https://back-end-siveth-g8vc.vercel.app/api/slider/${id}`);
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record', error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <div className="">
        <SliderList records={records} deleteRecord={deleteRecord} setEditRecord={setEditRecord} />
      </div>
    </div>
  );
};

export default SliderAdmin;
