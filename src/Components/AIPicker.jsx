import React from 'react'
import CustomButon from './CustomButon'
const AIPicker = ({ prompt, setPrompt, generatingImg, handleSubmit }) => {
  return (
    <div className='aipicker-container'>
      <textarea
        className='aipicker-textarea'
        placeholder='Ask Ai'
        value={prompt}
        rows={5}
        onChange={(e) => { setPrompt(e.target.value) }}
      />
      <div className='flex flex-wrap gap-3'>
        {generatingImg ?
          (<CustomButon
            type='outline'
            title="Asking Ai"
            customStyles="text-xs"
          />) :
          (
            <>
              <CustomButon
                type="outline"
                title="Ai Logo"
                handleClick={() => { handleSubmit('logo') }}
                customStyles="text-xs"
              />
              <CustomButon
                type="filled"
                title="Ai Full"
                handleClick={() => { handleSubmit('full') }}
                customStyles="text-xs"
              />
            </>
          )
        }
      </div>
    </div>
  )
}

export default AIPicker