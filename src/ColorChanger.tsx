import React from 'react';

interface ColorChangerProps {
  colorCode: String;
  onColorChange: () => void;
}

export default function ColorChanger(props: ColorChangerProps) {
  return (
    <div id="color-changer" onClick={props.onColorChange}>
      <span>
        {`✦ ${props.colorCode.slice(1)}`}
      </span>
    </div>
  );
}
