const isProperty = (key) => key === "children";

function render(element, container) {
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);
  Object.keys(element.props).forEach((name) => {
    if (isProperty(name)) return;
    dom[name] = element.props[name];
  });
  container.append(dom);
  element.props.children.forEach((child) => render(child, dom));
}

export { render };
