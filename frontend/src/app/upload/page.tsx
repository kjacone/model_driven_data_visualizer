"use client"

import UploadDatabase from '@/components/UploadDatabase';
import React, { useState } from 'react';

const Upload: React.FC = () => {
    const [databaseInfo, setDatabaseInfo] = useState<any>(null); // Adjust type as needed

    return (
       <UploadDatabase setDatabaseInfo={setDatabaseInfo} />   
    );
};

export default Upload;
