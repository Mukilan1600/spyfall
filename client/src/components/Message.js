import React from "react";

const Message = (props) => {
  const { name, msg, time, type } = props;
  return (
    <React.Fragment>
      {type === 0 ? (
        <div className="border rounded p-1 m-1">
          <small>
            {name}, {time}
          </small>
          <br />
          {msg}
        </div>
      ) : type === 1 ? (
        <div
          className="border rounded p-1 m-1"
          style={{ backgroundColor: "rgba(255,50,50,0.4)" }}
        >
          <small>
            {name}, {time}
          </small>
          <br />
          {msg}
        </div>
      ) : (
        <div
          className="border rounded p-1 m-1"
          style={{ backgroundColor: "rgba(50,255,50,0.4)" }}
        >
          <small>
            {name}, {time}
          </small>
          <br />
          {msg}
        </div>
      )}
    </React.Fragment>
  );
};

export default Message;
