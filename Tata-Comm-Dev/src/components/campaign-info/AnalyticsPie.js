/* author: Tirouvengadaramanane
Description: Dashboard infoviw page pie chart
*/
/* eslint-disable prefer-rest-params */
import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js';
import { chartTooltip } from 'components/charts/util';

const AnalyticsPie = ({ data, shadow = false }) => {
  const pieChartOptions1 = {
    legend: {
      position: 'right',
      labels: {
        boxWidth: 20,
        padding: 20,
        usePointStyle: false,
        fontSize: 12,
        maxHeight: 60,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: false,
    },
    layout: {
      padding: {
        bottom: 20,
        right: 500,
      },
    },
    tooltips: chartTooltip,
  };

  const chartContainer = useRef(null);
  const [, setChartInstance] = useState(null);

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      if (shadow) {
        Chart.defaults.pieWithShadow = Chart.defaults.pie;
        Chart.controllers.pieWithShadow = Chart.controllers.pie.extend({
          draw(ease) {
            Chart.controllers.pie.prototype.draw.call(this, ease);
            const {
              chart: { ctx },
            } = this;
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.15)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 10;
            ctx.responsive = true;
            Chart.controllers.pie.prototype.draw.apply(this, arguments);
            ctx.restore();
          },
        });
      }
      const context = chartContainer.current.getContext('2d');
      if (context) {
        const newChartInstance = new Chart(context, {
          type: shadow ? 'pieWithShadow' : 'pie',
          options: pieChartOptions1,
          data,
        });
        setChartInstance(newChartInstance);
      }
    }
  }, [chartContainer, data, shadow]);

  return <canvas ref={chartContainer} />;
};

export default AnalyticsPie;
