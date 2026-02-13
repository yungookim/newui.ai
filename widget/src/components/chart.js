'use strict';

const { createDataClient } = require('../data-client');
const { createLoadingElement, createErrorElement, hasLiveQuery } = require('./ui-states');

/**
 * Renders a chart component — simple bar/line/pie visualization using CSS.
 * No external charting library — uses pure DOM/CSS for lightweight rendering.
 * Supports live query binding: if node.query + node.resolved exist,
 * fetches data for chart datasets.
 * @param {object} node - DSL chart node
 * @returns {HTMLElement}
 */
function renderChart(node) {
  const wrapper = document.createElement('div');
  wrapper.className = 'ncodes-dsl-chart-wrapper';

  if (node.title) {
    const h = document.createElement('h3');
    h.className = 'ncodes-dsl-section-title';
    h.textContent = node.title;
    wrapper.appendChild(h);
  }

  if (hasLiveQuery(node)) {
    wrapper.appendChild(createLoadingElement());
    fetchAndRenderChart(wrapper, node);
  } else {
    buildChartContent(wrapper, node.chartType || 'bar', node.labels || [], node.datasets || []);
  }

  return wrapper;
}

/**
 * Fetch data from the resolved endpoint and render the chart.
 */
async function fetchAndRenderChart(wrapper, node) {
  const loading = wrapper.querySelector('.ncodes-dsl-loading');
  try {
    const client = createDataClient();
    const data = await client.executeQuery(node.resolved, node.query);
    if (loading) loading.remove();

    // Response may provide labels and datasets, or just datasets
    const chartType = node.chartType || 'bar';
    let labels = node.labels || [];
    let datasets = node.datasets || [];

    if (data && typeof data === 'object') {
      if (Array.isArray(data.labels)) labels = data.labels;
      if (Array.isArray(data.datasets)) datasets = data.datasets;
    }

    buildChartContent(wrapper, chartType, labels, datasets);
  } catch (err) {
    if (loading) loading.remove();
    wrapper.appendChild(createErrorElement(err.message));
  }
}

/**
 * Build chart DOM elements and append to wrapper.
 */
function buildChartContent(wrapper, chartType, labels, datasets) {
  if (chartType === 'bar' || chartType === 'line') {
    wrapper.appendChild(renderBarOrLine(chartType, labels, datasets));
  } else if (chartType === 'pie' || chartType === 'doughnut') {
    wrapper.appendChild(renderPie(chartType, labels, datasets));
  }

  // Legend
  if (datasets.length > 0) {
    const legend = document.createElement('div');
    legend.className = 'ncodes-dsl-chart-legend';
    for (let i = 0; i < datasets.length; i++) {
      const item = document.createElement('span');
      item.className = 'ncodes-dsl-chart-legend-item';
      const swatch = document.createElement('span');
      swatch.className = 'ncodes-dsl-chart-swatch';
      swatch.dataset.index = String(i);
      item.appendChild(swatch);
      const text = document.createTextNode(datasets[i].label || `Series ${i + 1}`);
      item.appendChild(text);
      legend.appendChild(item);
    }
    wrapper.appendChild(legend);
  }
}

function renderBarOrLine(chartType, labels, datasets) {
  const container = document.createElement('div');
  container.className = `ncodes-dsl-chart ncodes-dsl-chart--${chartType}`;

  // Find max value for scaling
  let max = 0;
  for (const ds of datasets) {
    for (const v of (ds.data || [])) {
      if (v > max) max = v;
    }
  }
  if (max === 0) max = 1;

  const barsArea = document.createElement('div');
  barsArea.className = 'ncodes-dsl-chart-bars';

  for (let i = 0; i < labels.length; i++) {
    const group = document.createElement('div');
    group.className = 'ncodes-dsl-chart-bar-group';

    for (let d = 0; d < datasets.length; d++) {
      const val = (datasets[d].data || [])[i] || 0;
      const pct = Math.round((val / max) * 100);
      const bar = document.createElement('div');
      bar.className = 'ncodes-dsl-chart-bar';
      bar.dataset.index = String(d);
      bar.style.height = `${pct}%`;
      bar.title = `${datasets[d].label}: ${val}`;
      group.appendChild(bar);
    }

    barsArea.appendChild(group);
  }
  container.appendChild(barsArea);

  // X-axis labels
  const xAxis = document.createElement('div');
  xAxis.className = 'ncodes-dsl-chart-x-axis';
  for (const label of labels) {
    const span = document.createElement('span');
    span.textContent = label;
    xAxis.appendChild(span);
  }
  container.appendChild(xAxis);

  return container;
}

function renderPie(chartType, labels, datasets) {
  const container = document.createElement('div');
  container.className = `ncodes-dsl-chart ncodes-dsl-chart--${chartType}`;

  const data = (datasets[0] && datasets[0].data) || [];
  const total = data.reduce((s, v) => s + v, 0) || 1;

  const pieContainer = document.createElement('div');
  pieContainer.className = 'ncodes-dsl-pie-container';

  // Build conic-gradient segments as data attributes for CSS
  let accumulated = 0;
  const segments = [];
  for (let i = 0; i < data.length; i++) {
    const pct = (data[i] / total) * 100;
    segments.push({ start: accumulated, end: accumulated + pct, index: i });
    accumulated += pct;
  }
  pieContainer.dataset.segments = JSON.stringify(segments);
  pieContainer.dataset.chartType = chartType;

  // Pie slices as list (accessible fallback)
  for (let i = 0; i < labels.length; i++) {
    const slice = document.createElement('div');
    slice.className = 'ncodes-dsl-pie-label';
    const pct = Math.round((data[i] / total) * 100);
    slice.textContent = `${labels[i]}: ${data[i]} (${pct}%)`;
    slice.dataset.index = String(i);
    container.appendChild(slice);
  }

  container.insertBefore(pieContainer, container.firstChild);
  return container;
}

module.exports = { renderChart };
