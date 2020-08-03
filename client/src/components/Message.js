import React from "react";

const Message = (props) => {
  const { name, msg } = props;
  return (
    <div className="border rounded p-2 m-1">
      <p>
        <small>{name}</small>
        <br />
        {msg}
      </p>
    </div>
  );
};

export default Message;
