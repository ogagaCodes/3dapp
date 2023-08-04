import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'

import config from '../config/config'
import state from '../store'
import { download } from '../assets'
import { downloadCanvasToImage, reader } from '../config/helpers'
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants'
import { fadeAnimation, slideAnimation } from '../config/motion'
import { AIPicker, ColorPicker, Tab, FilePicker, CustomButon } from '../Components'


const Customisers = () => {
    const snap = useSnapshot(state)

    const [file, setFile] = useState("")
    const [prompt, setPrompt] = useState("")
    const [generatingImg, setGeneratingImg] = useState(false)
    const [activeEditorTab, setActiveEditorTab] = useState("")
    const [activeFilterTab, setActiveFilterTab] = useState({
        logoShirt: true,
        stylishShirt: false
    })

    // show tab content dependiong po the active tab

    const generateTabContent = () => {
      switch (activeEditorTab) {
        case 'colorpicker':
            return <ColorPicker />
        case 'filepicker':
            return <FilePicker 
            file={file}
            setFile={setFile}
            readFile={readFile}
            />       
        case 'aipicker':
            return <AIPicker 
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
            />
        default:
            break;
      }
    }
    const handleSubmit = async (type) => {
     if(!prompt) return alert("Please enter a prompt");
     try {
        console.log("PROMPT === ", prompt)
        // call backend to genarate ai image
        setGeneratingImg(true)
        const response = await fetch('http://localhost:8088/api/v1/dallee',
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                prompt,
            })
        })
        const data = await response.json();
        console.log("Server Data ==== ", data)
        console.log("Or Photo ==== ", data.photo)
        handleDecals(type, `data:image/png;base64,${data.photo}`)
     } catch (error) {
        alert(error)
     } finally{
        setGeneratingImg(false)
        setActiveEditorTab("")
     }
    } 

    const handleDecals = (type, result) => {
        const decalType = DecalTypes[type]
        state[decalType.stateProperty] = result
         if(!activeFilterTab[decalType.filterTabs]){
            handleActiveDecaFilterTabs(decalType.filterTabs)
         }
    }

    const handleActiveDecaFilterTabs = (tabName) => {
       switch (tabName) {
        case "logoShirt":
            state.isLogoTexture = !activeFilterTab[tabName]
            break;
        case "stylishShirt":
            state.isFullTexture = !activeFilterTab[tabName]
            break;
        default:
            state.isLogoTexture = true;
            state.isFullTexture = false;
            break;
       }
    //    after setting the sate
    setActiveFilterTab((prevState) => {
        return {
            ...prevState,
            [tabName] : !prevState[tabName]
        }
    })
    }
    const readFile = (type) => {
        reader(file).then((result) => {
            handleDecals(type, result);
            setActiveEditorTab("")
        })
    }
    return (
        <AnimatePresence>
            {
                !snap.intro &&
                (
                    <>
                        <motion.div
                            key="custom"
                            className="absolute top-0 left-0 z-10"
                            {...slideAnimation('left')}
                        >
                            <div className="flex items-center min-h-screen">
                                <div className="editortabs-container tabs">
                                    {EditorTabs.map((tab) => (
                                        <Tab
                                            key={tab.name}
                                            tab={tab}
                                            handleClick={() => {  setActiveEditorTab(tab.name)}}
                                        />
                                    ))}
                                    {generateTabContent()}
                                </div>
                            </div>
                        </motion.div>
                        <motion.div className='absolute z-10 top-5 right-5' {...fadeAnimation}>
                            <CustomButon type="filled" title="Go Back" handleClick={() => { state.intro = true }} customStyles="w-fit px-4 py-2.5 font-bold text-sm" />
                        </motion.div>
                        <motion.div className='filtertabs-container' {...slideAnimation('up')}>
                            {FilterTabs.map((tab) => (
                                <Tab
                                    key={tab.name}
                                    tab={tab}
                                    isFilterTab
                                    isActiveTab={activeFilterTab[tab.name]}
                                    handleClick={() => { handleActiveDecaFilterTabs(tab.name)}}
                                />
                            ))}
                        </motion.div>
                    </>
                )
            }
        </AnimatePresence>
    )
}

export default Customisers