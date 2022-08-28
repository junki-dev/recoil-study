import React from "react";
import { RecoilRoot } from "recoil";
import CharacterCounter from "./Charactor/CharacterCounter";
import TodoList from "./Todo/TodoList";

function App() {
  return (
    <RecoilRoot>
      <CharacterCounter />
      <TodoList />
    </RecoilRoot>
  );
}

export default App;
