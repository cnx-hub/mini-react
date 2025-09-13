import React from "./react.js";

export function createRoot(container) {
  return {
    render: (dom) => React.render(dom, container),
  };
}
