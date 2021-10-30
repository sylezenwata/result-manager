const ComponentLoader = () => {
    return (
        <>
        <div id="main-con">
            <div className="main-con__wrap flex flex-col p-lr-10">
                <div className="main-con__content position-r flex justify-c p-lr-10">
                    <div className="base__component position-r">
                        <div className="base-content" style={{position: 'relative',padding:'40px 20px',backgroundColor: 'transparent'}}>
                            <div className="base-dots"></div>
                            <div className="base-dots"></div>
                            <div className="base-dots"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default ComponentLoader;