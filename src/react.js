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
    alternate: currentRoot,
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
  deletions.forEach(commitWork);
  deletions = [];
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
  if (fiber.effectTag === "DELETION") {
    commitDeletions(fiber, parentDom);
    return;
  }
  if (fiber.effectTag === "UPDATE") {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  }
  if (fiber.effectTag === "PLACEMENT" && fiber.dom) {
    parentDom.append(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitDeletions(fiber, parentDom) {
  if (fiber.dom) {
    parentDom.removeChild(fiber.dom);
  } else {
    commitDeletions(fiber.child, parentDom);
  }
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

let deletions = [];

function reconcileChildren(fiber, elements) {
  let oldFiber = fiber.alternate && fiber.alternate.child;

  let index = 0;
  let prevSibling = null;
  while (index < elements.length || oldFiber) {
    const element = elements[index];

    const sameType = oldFiber && oldFiber.type === element.type;

    let newFiber;
    // update
    if (sameType) {
      newFiber = {
        type: element.type,
        dom: oldFiber.dom,
        parent: fiber,
        props: element.props,
        alternate: oldFiber,
        sibling: null,
        child: null,
        effectTag: "UPDATE",
      };
    }
    // create
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        dom: null,
        parent: fiber,
        props: element.props,
        sibling: null,
        child: null,
        effectTag: "PLACEMENT",
      };
    }

    // delete
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    if (oldFiber) oldFiber = oldFiber.sibling;

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
const isGone = (prev, next) => (key) => !(key in next);
const isNew = (prev, next) => (key) => prev[key] !== next[key];

function updateDom(dom, prev, next) {
  Object.keys(prev)
    .filter(isProperty)
    .filter(isGone(prev, next))
    .forEach((key) => {
      dom[key] = "";
    });

  Object.keys(next)
    .filter(isProperty)
    .filter(isNew(prev, next))
    .forEach((key) => {
      dom[key] = next[key];
    });

  Object.keys(next)
    .filter(isEvent)
    .filter(key => isGone(prev, next)(key) || isNew(prev, next)(key))
    .forEach((event) => {
      dom.removeEventListener(eventType(event), prev[event]);
    });

  Object.keys(next)
    .filter(isEvent)
    .forEach((event) => {
      dom.addEventListener(eventType(event), next[event]);
    });
}

function createDom(fiber) {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
}

export default { render, createElement, update };
