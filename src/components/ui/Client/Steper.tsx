'use client'
import { Check } from "lucide-react"
import { useState } from "react"

export function StepperCreation() {
    const steps = ["Choisir votre Type D'etablissement", "Selectionner des Options", "Finir la creation"]
    const [curentStep, setCurentStep] = useState(1)
    const [completedStep, setCompletedStep] = useState(false)
    return (
        <>
            <div className="flex flex-col justify-center items-center">
                <div className="flex justify-between w-full">
                    {
                        steps.map((step, i) => (
                            <div key={i} className={`step-items w-full ${curentStep === i + 1 && 'active'} ${(i + 1 < curentStep || completedStep) && 'complete'}`}>
                                <div className="step">
                                    {(i + 1 < curentStep || completedStep) ? <Check size={24} /> : i + 1 }
                                </div>
                                <p>{step}</p>
                            </div>
                        ))
                    }
                </div>
                
                {
                    !completedStep && <button className="bg-gray-800 hover:bg-gray-700 text-gray-100 font-medium px-7 py-1 mt-8 rounded-md" onClick={() => {
                        if (curentStep === steps.length) {
                            setCompletedStep(true);
                        } else {
                            setCurentStep(prev => prev + 1);
                        }
    
                    }}>{curentStep === steps.length ? 'Finish' :'Next' }  </button>
                }
                {
                   ( !completedStep && steps.length ==curentStep) &&   <button className="bg-gray-800 hover:bg-gray-700 text-gray-100 font-medium px-7 py-1 mt-8 rounded-md" onClick={() => {
                        if (curentStep !== steps.length) {
                            setCompletedStep(true);
                        } else {
                            setCurentStep(prev => prev - 1);
                        }
    
                    }}>prev </button>
                }
              
          

            </div>

        </>





    )

}