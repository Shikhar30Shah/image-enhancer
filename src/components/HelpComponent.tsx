"use client";

import { useEffect, useState } from "react";
import { CircleQuestionMark } from "lucide-react";

export default function HelpComponent() {

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if(document.cookie.indexOf('helpOpened=true')===-1) {
            const timer = setTimeout(() => {
                setOpen(true);
                document.cookie = "helpOpened=true; max-age=31536000; path=/";
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <>
        <div >
            <CircleQuestionMark onClick={() => setOpen(true)} className="help-icon" />
        </div>

            {<div
                role="dialog"
                aria-modal="true"
                className={`fixed ${open ? 'dialog-open' : 'dialog'} inset-0 z-[99999999999] text-[16px] font-medium xs:text-[14px] flex items-center justify-center`}
            >
                <div className='absolute inset-0 overflow-y-hidden bg-black opacity-50' onClick={() => setOpen(false)}></div>

                <div className="relative z-10 mx-4 h-[70%] md:h-fit bg-gradient-to-br from-blue-500 to-purple-500 w-[90%] sm:w-[60%] md:w-[60%] lg:w-[40%] overflow-y-auto rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">How to Use DP Maker</h2>
                    <p className="mb-4">Welcome to DP Maker! Follow these simple steps to create stunning profile pictures with custom backgrounds:</p>
                    <ol className="list-decimal list-inside mb-4 space-y-2">
                        <li><strong>Upload an Image:</strong> Click on the upload area to select an image from your device or drag and drop an image file.</li>
                    </ol>
                    <ol start={2} className="list-decimal list-inside mb-4 space-y-2">
                        <li><strong>Remove Background:</strong> After uploading, click the Convert button to remove the background from your image.</li>
                    </ol>
                    <ol start={3} className="list-decimal list-inside mb-4 space-y-2">
                        <li><strong>Customize Background:</strong> Choose a preset background color, pick a custom color using the color picker, or upload your own background image.</li>
                    </ol>
                    <ol start={4} className="list-decimal list-inside mb-4 space-y-2">
                        <li><strong>Download Your Image:</strong> Once you are satisfied with your edits, click the Download button to save your new profile picture.</li>
                    </ol>
                    <div className="flex justify-end">
                        <button
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Close
                        </button>
                    </div>
                </div>

            </div>}  
        </>
    );
}
