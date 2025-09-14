import React from "./react";

let a = 1;

function H3() {
  return <h3>h3</h3>;
}

function H4() {
  return <h4>h4</h4>;
}

const App = function (props) {
  const onClick = () => {
    a++;
    React.update();
  };

  return (
    <div>
      <button id="app" onClick={onClick}>
        houdunren -- {a}
      </button>
      {a % 2 === 0 ? <div>偶数</div> : <div>奇数</div>}
      {/* <H3 /> */}
      {/* {a % 2 === 0 ? <H3 /> : <H4 />} */}
      {/* {a % 2 === 0 ? <H3 /> : <H4 />} */}
    </div>
  );
};

export default App;
