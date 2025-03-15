interface ProgresseBarsPrpos{
    curentstep:number,
    steps:{title:string,description:string}[]
}
export default function ProgresseBars({curentstep,steps}:ProgresseBarsPrpos) {
    const progressWith=((curentstep-1)/(steps.length-1))*100
  return (
    <div className="w-full py-4 mb-8">
        <div className="relative">
            <div className="absolute top-4 bg-gray-200 left-[10%] right-[10%] h-2">
                <div className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500" style={{width:`${progressWith}%`}}/>
            </div>
            <div className="flex justify-between mx-auto ">
                {
                    steps.map((step,index)=>(
                        <div key={index} className={`relative flex flex-col items-center ${index===0 ? 'ml-0' : index===steps.length-1 ? 'mr-0' : ""}`} 
                        style={{width:'20%',
                        marginLeft:index ===0 ? '0' : "",
                        marginRight:index===steps.length -1 ? "0": ""
                        }}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${index+1<=curentstep ? 'bg-blue-600 text-white' :'bg-gray-200 text-gray-600'}`} >
                                    {index+1}
                            </div>
                            <div className="text-center mt-2">
                                <div className={`text-sm font-medium transition-all duration-300 ${index+1<=curentstep ? 'text-blue-600': 'text-gray-500'}`}>
                                    {step.title}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {step.description}
                                </div>

                            </div>
                        </div>
                    ))
                }

            </div>
        </div>
      
    </div>
  )
}
