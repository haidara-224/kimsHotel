const spinnerStyle = {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 2s linear infinite",
};
export default function SpinerStyle(){
    return (
        <div className="flex justify-center items-center h-64 w-full">
            <div style={spinnerStyle}></div>
        </div>
    );
}