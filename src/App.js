import React, { useState } from "react";

import Form from "./Form";
import "./App.css";

const currentFunction = new WeakMap()
// This needs to return the same function every time it is called, but that one
// unchanging function should call the last `fn` that was passed to this.
function useWrapperFunction(fn) {
  const [ anchor ] = useState({})

  if (!currentFunction.has(anchor)) {
    function wrapperFunction (...args) {
      const fn = currentFunction.get(wrapperFunction)
      return fn.apply(this, args)
    }
    currentFunction.set(anchor, wrapperFunction)
  }

  const wrapperFunction = currentFunction.get(anchor)
  currentFunction.set(wrapperFunction, fn)
  return wrapperFunction
}

export default () => {
  const [todos, setTodos] = useState([]);

  const toggleComplete = i =>
    setTodos(
      todos.map(
        (todo, k) =>
          k === i
            ? {
                ...todo,
                complete: !todo.complete
              }
            : todo
      )
    );

  const onSubmit = useWrapperFunction(text => setTodos([{ text, complete: false }, ...todos]))

  return (
    <div className="App">
      <Form
        onSubmit={onSubmit}
      />
      <div>
        {todos.map(({ text, complete }, i) => (
          <div
            key={text}
            onClick={() => toggleComplete(i)}
            style={{
              textDecoration: complete ? "line-through" : ""
            }}
          >
            {text}
          </div>
        ))}
      </div>
      <button onClick={() => setTodos([])}>reset</button>
    </div>
  );
};
