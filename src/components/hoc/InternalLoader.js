const InternalLoader = ({ message, column = false }) => {
    return (
        <>
        <span className={`flex justify-c align-c${column ? ' flex-col' : ''}`}>
            <span className="jx-loader"></span>
            <span className="text-center f-12 p-lr-5">{message}</span>
        </span>
        </>
    );
};

export default InternalLoader;