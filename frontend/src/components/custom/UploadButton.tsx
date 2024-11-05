import React, { useRef, useState } from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';



interface GetStartedCardsProps {
  handleFileUpload: (file: File) => Promise<void>;
  disabled: boolean;
}
const UploadButton: React.FC<GetStartedCardsProps> = ( {handleFileUpload, disabled} ) => {
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('File size should be less than 1 MB')
        return
      }
      if (file.name.endsWith('.sqlite') || file.name.endsWith('.csv')) {
        setFileName(file.name)
        handleFileUpload(file)
      } else {
        alert('Please select a valid .sqlite or .csv file')
      }
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleClick = () => {
    triggerFileInput()
  }

  return (
    <>

      <div className='flex items-center justify-center space-x-4 p-4'>
        <Input
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          name='file'
          accept='.sqlite,.csv'
          className='hidden'
        />
        <Button
          onClick={handleClick}
          disabled={disabled}
          className={` rounded hover:bg-gray-500 transition-colors duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {fileName ? (disabled ? `Uploading: ${fileName}` : `Uploaded: ${fileName}`) : 'Upload SQLite or CSV'}
        </Button>
      </div>

      <div className='text-center justify-center px-10 py-1'>
        <p className='text-sm text-gray-600'>
          Don't have a .sqlite or .csv file to query? We'll use this one by default:{' '}
          <a
            href='https://docs.google.com/spreadsheets/d/1S2mYAKwYYmjZW6jURiAfMWTVmwg74QQDfwdMUvVEgMk/edit?usp=sharing'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-300 hover:text-blue-100'
          >
            Sample Dataset
          </a>
        </p>
      </div>

    </>
  )
}

export default UploadButton
