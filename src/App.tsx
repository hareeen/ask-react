import React, { useState } from 'react';
import firebaseInit from './firebase';

import ColorChanger from './ColorChanger';
import QuestionForm from './QuestionForm';
import QuestionList from './QuestionList';

// Returns random integer choosed from range [from, to)
function randInt(from: number, to: number): number {
  return Math.floor(Math.random() * (to - from) + from);
}

export default function App() {
  firebaseInit();

  const colors: String[] = ['#404759', '#467f8c', '#f2dd72', '#f2bbbb', '#382f4b', '#005daa', '#ab94fc', '#abcdef', '#c7e2cf', '#c4beef', '#ef4b3f', '#134515'];
  const [color, setColor] = useState(randInt(0, colors.length));

  // 0: not update, 1: appendFront, 2: appendBack
  let [willUpdate, setWillUpdate] = useState(2);

  function onColorChange() {
    let nextColor: number = randInt(0, colors.length);
    while (nextColor === color) nextColor = randInt(0, colors.length);
    setColor(nextColor);
  }

  return (
    <div className={`c${color + 1}`}>
      <div className="hiu section full" id="first">
        <ColorChanger colorCode={colors[color]} onColorChange={onColorChange} />
        <QuestionForm onUpdate={() => setWillUpdate(1)} />
      </div>
      <div className="hiu section full" id="second">
        <QuestionList willUpdate={willUpdate} setWillUpdate={setWillUpdate} />
      </div>
    </div>
  );
}
