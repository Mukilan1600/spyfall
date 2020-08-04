import React from "react";

const Message = (props) => {
  const { name, msg, time } = props;
  return (
    <div className="border rounded p-1 m-1">
      <small>
        {name}, {time}
      </small>
      <br />
      {msg}
    </div>
  );
};

export default Message;
