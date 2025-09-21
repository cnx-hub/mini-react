import React, { useState } from "./react";

function H3() {
  const [value, setValue] = useState(0);
  return <h3>h3 -- {value}</h3>;
}

function H4() {
  return <h4>h4</h4>;
}

const App = function (props) {
  const [count, setCount] = useState(0);

  const onClick = () => {
    // setCount((count) => count + 1);
    setCount(3);
  };

  return (
    <div>
      <button id="app" onClick={onClick}>
        houdunren -- {count}
      </button>
      {count % 2 === 0 ? <div>偶数</div> : <div>奇数</div>}
      <H3 />
      {/* {a % 2 === 0 ? <H3 /> : <H4 />} */}
      {/* {a % 2 === 0 ? <H3 /> : <H4 />} */}
    </div>
  );
};

export default App;
