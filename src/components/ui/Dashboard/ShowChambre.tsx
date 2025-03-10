import { Chambre } from "@/types/types";



interface ShowChambreProps {
  open: boolean;
  onOpenChange: () => void;
  Chambre:Chambre | null;
}

export function ShowChambre({ open, onOpenChange,Chambre }: ShowChambreProps) {
  return (
    <div>
    
    
      {open && (
        <div
          className="fixed inset-0 z-50 bg-gray-700 bg-opacity-50 flex justify-center items-center"
          onClick={onOpenChange}
        >
          <div
            className={`bg-white dark:bg-slate-800 w-full h-full max-w-screen-lg p-6 rounded-lg overflow-auto 
            transform transition-all duration-500 ease-out ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                 Information de sur La Chambre
                </h1>
                
              </div>
              <button
                className="text-xl w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full"
                onClick={onOpenChange}
              >
                X
              </button>
            </div>
            <div className="mt-8 space-y-6">
              <h3 className="text-xl text-slate-700 dark:text-slate-300 mb-4">
              Capacité: {Chambre?.capacity}
              </h3>
              <h3 className="text-xl text-slate-700 dark:text-slate-300 mb-4">
              Prix: {Chambre?.price}
              </h3>
              <p className="text-lg text-slate-500 dark:text-slate-200">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Vivamus nec tristique velit. Sed cursus lectus in libero
                tincidunt, ut pretium est facilisis.
              </p>
              <h3 className="text-xl text-slate-700 dark:text-slate-300 mt-6 mb-4">
                Options Disponibles
              </h3>
              <ul className="list-disc pl-5 text-lg text-slate-500 dark:text-slate-200">
                <li>Option 1</li>
                <li>Option 2</li>
                <li>Option 3</li>
              </ul>
            </div>

            
          </div>
        </div>
      )}
    </div>
  );
}
