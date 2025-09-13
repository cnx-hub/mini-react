import React from "./react";

let a = 1;

const App = function (props) {
  const onClick = () => {
    a++;
    console.log(a);
    
    React.update();
  };

  return (
    <div
      id="app"
      style="background-color: #f0f0f0; width: 100px; height: 100px "
      onClick={onClick}
    >
      houdunren -- {a}
    </div>
  );
};

export default App;
