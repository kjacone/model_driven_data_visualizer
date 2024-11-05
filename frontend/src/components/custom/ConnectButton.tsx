import React, { useRef, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

interface ConnectButtonProps {
  disabled?: boolean
}

const ConnectButton: React.FC<ConnectButtonProps> = ({  disabled }) => {
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

 
 

  const handleClick = () => {
   console.log("connect button clicked")
  }

  return (
    <>
   
    <div className='text-center justify-between px-10 py-3 text-sm'>
      You can also connect to your database
    </div>
    <div className='flex items-center justify-between px-4 py-2'>
      <Input
        type='text'
        placeholder='Database URI (e.g. sqlite:///db.sqlite)'
        className='flex-1 text-sm'
      />
      <Button
        onClick={handleClick}
        disabled={disabled}
        className={`px-4 py-2 text-sm rounded hover:bg-gray-500 transition-colors duration-300 ml-2 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {fileName ? (disabled ? `Uploading: ${fileName}` : `Uploaded: ${fileName}`) : 'Connect to Database'}
      </Button>
    </div>
    </>
  )
}

export default ConnectButton
