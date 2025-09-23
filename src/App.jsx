import React, { useState, useEffect } from "./react";

function H3({ value }) {
  // const [value, setValue] = useState(0);

  // useEffect(() => {
  //   console.log("useEffect H3....");
  // }, [value]);
  return (
    <div>
      {/* <button onClick={() => setValue(pre => pre + 1)}>h3 btn</button> */}
      <h3>h3 -- {value}</h3>
      <H4 />
    </div>
  );
}

function H4() {
  return <h4>h4</h4>;
}

const App = function (props) {
  const [count, setCount] = useState(0);

  const onClick = () => {
    setCount((count) => count + 1);
    // setCount(3);
  };

  useEffect(() => {
    // console.log("useEffect1....");
    return () => {
      console.log("clear --- 1");
    };
  }, [123]);

  useEffect(() => {
    // console.log("useEffect2....");
    return () => {
      console.log("clear --- ", count);
    };
  }, [count]);

  return (
    <div>
      <button id="app" onClick={onClick}>
        houdunren -- {count}
      </button>
      {count % 2 === 0 ? <div>偶数</div> : <div>奇数</div>}
      <H3 value={count} />
      {/* {a % 2 === 0 ? <H3 /> : <H4 />} */}
      {/* {a % 2 === 0 ? <H3 /> : <H4 />} */}
    </div>
  );
};

export default App;
