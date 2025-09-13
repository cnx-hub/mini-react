const createTextElement = (text) => {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
};

const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
};

let nextUnitOfWork, wipFiber, currentRoot;

function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };

  wipFiber = nextUnitOfWork;
}

function update() {
  nextUnitOfWork = {
    ...currentRoot,
  };
  wipFiber = nextUnitOfWork;
}

function workLoop(dealing) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = dealing.timeRemaining() < 1;
  }
  // start render dom
  if (!nextUnitOfWork && wipFiber) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function commitRoot() {
  commitWork(wipFiber.child);
  currentRoot = wipFiber;
  wipFiber = null;
}

function commitWork(fiber) {
  if (!fiber) return;
  let parentFiber = fiber.parent;
  while (!parentFiber.dom) {
    parentFiber = parentFiber.parent;
  }
  const parentDom = parentFiber.dom;
  if (fiber.dom) {
    parentDom.append(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function;

  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  if (fiber.child) return fiber.child;
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    } else {
      nextFiber = nextFiber.parent;
    }
  }
}

function updateFunctionComponent(fiber) {
  fiber.props.children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, fiber.props.children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}

function reconcileChildren(fiber, elements) {
  let index = 0;

  let prevSibling = null;
  while (index < elements.length) {
    const element = elements[index];
    const newFiber = {
      type: element.type,
      dom: null,
      child: null,
      parent: fiber,
      props: element.props,
      sibling: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }
}

const isEvent = (key) => key.startsWith("on");
const isProperty = (key) => key !== "children" && !isEvent(key);
const eventType = (key) => key.substring(2).toLowerCase();

function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((key) => {
      dom[key] = fiber.props[key];
    });

  Object.keys(fiber.props)
    .filter(isEvent)
    .forEach((event) => {
      dom.addEventListener(eventType(event), fiber.props[event]);
    });

  return dom;
}

export default { render, createElement, update };
