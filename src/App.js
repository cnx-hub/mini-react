const element = {
  type: "div",
  props: {
    id: "app",
    style: " background-color: #f0f0f0; width:100px; height: 100px",
    children: [
      {
        type: "TEXT_ELEMENT",
        props: {
          nodeValue: "hello world",
          children: [],
        },
      },
    ],
  },
};

export default element;
