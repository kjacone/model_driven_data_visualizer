import React, { useCallback, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import UploadButton from './custom/UploadButton';
import ConnectButton from './custom/ConnectButton';


interface UploadDatabaseProps {
    setDatabaseInfo: (info: { name: string; uuid: string | null }) => void;
}



const UploadDatabase: React.FC<UploadDatabaseProps> = ({ setDatabaseInfo }) => {

    const [isUploading, setIsUploading] = useState(false)
   


    const uploadDatabase = useCallback(async (file: File): Promise<string> => {
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_SQLITE_URL + '/upload-file', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Upload failed')
            }

            const data = await response.json()
            return data.uuid
        } catch (error) {
            console.error('Error uploading file:', error)
            throw error
        }
    }, [])


    const handleFileUpload = useCallback(
        async (file: File) => {
            setIsUploading(true)
            try {
                const uuid = await uploadDatabase(file)
                setDatabaseInfo({ name: file.name, uuid: uuid })
                console.log(`File "${file.name}" uploaded successfully. UUID: ${uuid}`)
            } catch (error) {
                console.error('Failed to upload file:', error)
                alert('Failed to upload file')
            } finally {
                setIsUploading(false)
            }
        },
        [uploadDatabase, setDatabaseInfo],
    )






    return (
        <div>
            <Card className='py-4'>
                <CardHeader className='text-center justify-between px-10 py-3 '>
                    <CardTitle>Upload Data or Database</CardTitle>
                    <CardDescription>
                        Currently we are supporting .csv and .sqlite files.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UploadButton handleFileUpload={handleFileUpload} disabled={isUploading} />
                </CardContent>
            </Card>
            <Card className='py-2'>
                <CardHeader className='text-center justify-between px-10 py-3 '>
                    <CardTitle>Connect Database</CardTitle>
                    <CardDescription>
                        Currently we are supporting mongodb, postgres, mysql, oracle
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center space-x-4">
                        <img className="h-10 w-10" src="https://miro.medium.com/v2/resize:fit:512/1*doAg1_fMQKWFoub-6gwUiQ.png" alt="mongodb" />
                        <img className="h-10 w-10" src="https://banner2.cleanpng.com/20180315/eaq/av0cw3km1.webp" alt="postgres" />
                        <img className="h-10 w-10" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0URVRaLeOz-K44LLyxaRlKv5E_wN3R2mQkg&s" alt="mysql" />
                        <img className="h-10 w-10" src="https://logos-world.net/wp-content/uploads/2020/09/Oracle-Symbol.png" alt="oracle" />
                    </div>
                    <ConnectButton disabled={true} />
                </CardContent>
            </Card>
        </div>
    );
};

export default UploadDatabase;
