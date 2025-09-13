import React from "./react";

const App = function (props) {

  return (
    <div
      id="app"
      style="background-color: #f0f0f0; width: 100px; height: 100px "
    >
      houdunren -- {props.name}
    </div>
  );
};

export default App;
