/* eslint-disable prefer-rest-params */
import CommonEnums from 'enums/commonEnums';
import React, { useEffect, useRef } from 'react';

const StackedBar = ({ data }) => {
  const canvasRef = useRef(null);
  let barGraphData;
  useEffect(() => {
    if (data) {
      barGraphData = new Array(6).fill(0);

      for (let i = 1; i < barGraphData.length; i++) {
        barGraphData[i] = data[i] ? data[i] : 0;
      }
      barGraphData.shift();
    }
  }, [data]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx && barGraphData) {
        const colors = [
          CommonEnums.CSAT.RED,
          CommonEnums.CSAT.ORANGE,
          CommonEnums.CSAT.GOLD,
          CommonEnums.CSAT.YELLOW,
          CommonEnums.CSAT.GREEN,
        ];
        const totalWidth = canvas.width;
        const totalHeight = canvas.height;
        let startX = 0;
        barGraphData.forEach((value, index) => {
          const barWidth =
            (value / barGraphData.reduce((sum, val) => sum + val, 0)) *
            totalWidth;
          ctx.fillStyle = colors[index];
          ctx.fillRect(startX, 0, barWidth, totalHeight);
          startX += barWidth;
        });
      }
    }
  }, [barGraphData]);

  return <canvas ref={canvasRef} width={300} height={20} className="canvas" />;
};

export default StackedBar;
