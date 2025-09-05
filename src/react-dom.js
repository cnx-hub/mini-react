import { render } from "./react.js";

export function createRoot(container) {
  return {
    render: (dom) => render(dom, container),
  };
}
