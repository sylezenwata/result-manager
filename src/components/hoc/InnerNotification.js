const InnerNotification = ({ message, type }) => (
  <>
    <div className="inner-notification m-b-10">
      <div className={`inner-notification__content ${type}`}>
        <p>{message}</p>
      </div>
    </div>
  </>
);

export default InnerNotification;