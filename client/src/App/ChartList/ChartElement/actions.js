const customTooltips = function (tooltip, annotations) {
  // Tooltip Element
  let tooltipEl = document.getElementById('chartjs-tooltip');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'chartjs-tooltip';
    tooltipEl.innerHTML = '<table></table>';
    document.body.appendChild(tooltipEl);
  }

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set caret Position
  tooltipEl.classList.remove('above', 'below', 'no-transform');
  if (tooltip.yAlign) {
    tooltipEl.classList.add(tooltip.yAlign);
  } else {
    tooltipEl.classList.add('no-transform');
  }

  function getBody(bodyItem) {
    return bodyItem.lines;
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map(getBody);

    let innerHtml = '<thead>';
    let context;

    titleLines.forEach((title) => {
      innerHtml += `<tr><th>${title}</th></tr>`;
      if (annotations && annotations[title]) { context = annotations[title]; }
    });
    innerHtml += '</thead><tbody>';

    bodyLines.forEach((body, i) => {
      const colors = tooltip.labelColors[i];
      let style = `background: ${colors.backgroundColor}; `;
      style += `border-color: ${colors.borderColor}; `;
      style += 'border-width: 2px';
      const span = `<span class="chartjs-tooltip-key" style="${style}"></span>`;
      innerHtml += `<tr><td>${span}${body}</td></tr>`;
      if (context) {
        innerHtml += `<tr><td>Context: ${context}</td></tr>`;
      }
    });
    innerHtml += '</tbody>';

    const tableRoot = tooltipEl.querySelector('table');
    tableRoot.innerHTML = innerHtml;
  }

  const canvas = this._chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = `${canvas.offsetLeft + tooltip.caretX}px`;
  tooltipEl.style.top = `${canvas.offsetTop + tooltip.caretY}px`;
  tooltipEl.style.fontFamily = tooltip._fontFamily;
  tooltipEl.style.fontSize = tooltip.fontSize;
  tooltipEl.style.padding = `${tooltip.yPadding}px ${tooltip.xPadding}px`;
};

const getAdjacentLetter = (letter) => {
  const characterCode = letter.charCodeAt(0);
  return String.fromCharCode(characterCode + 1);
};

const buildConfiguration = (dataTable, type, startAtIndexZero) => {
  const annotations = {};
  const dataArray = [];
  const labelArray = [];
  const backgroundColorArray = [];
  const borderColorArray = [];
  const shapeArray = [];
  const pointRadiusArray = [];

  dataTable.rows.forEach((datapoint) => {
    // Collect annotations
    if (datapoint.c[2].v) {
      annotations[datapoint.c[0].f] = datapoint.c[2].v;
    }

    // Collect datapoints
    if (datapoint.c[1]) {
      let backgroundColor = 'rgba(255, 99, 132, 0.2)';
      let borderColor = 'rgba(255, 99, 132, 1)';
      let shape = 'circle';
      let pointRadius = 2;
      if (annotations[datapoint.c[0].f]) {
        backgroundColor = 'rgba(0, 0, 255, 0.3)';
        borderColor = 'rgba(0, 0, 255, 1)';
        shape = 'triangle';
        pointRadius = 8;
      }

      dataArray.push(datapoint.c[1].v);
      labelArray.push(datapoint.c[0].f);
      backgroundColorArray.push(backgroundColor);
      borderColorArray.push(borderColor);
      shapeArray.push(shape);
      pointRadiusArray.push(pointRadius);
    }
  });

  function custom(tooltip) {
    customTooltips.call(this, tooltip, annotations);
  }

  const data = {
    labels: labelArray,
    datasets: [{
      data: dataArray,
      backgroundColor: backgroundColorArray,
      borderColor: borderColorArray,
      pointBackgroundColor: backgroundColorArray,
      pointStyle: shapeArray,
      pointRadius: pointRadiusArray,
      pointHoverRadius: pointRadiusArray.map(radius => radius + 2),
      borderWidth: 1,
    }],
  };

  const scales = {
    yAxes: [{
      ticks: {
        beginAtZero: startAtIndexZero,
      },
    }],
  };

  const options = {
    tooltips: { enabled: false, mode: 'index', position: 'nearest', custom },
    responsive: true,
    scales,
  };

  return { type, data, options };
};

export { customTooltips, getAdjacentLetter, buildConfiguration };
