const BarLoader = ({ loading }) => (
    <>
    <div className={`bar-loader${loading ? ' show' : ''}`}></div>
    </>
);

export default BarLoader;