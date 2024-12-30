document.getElementById('toggleButton').addEventListener('click', () => {
    const chartZone = document.getElementById('item1');
    const content = document.getElementById('slideContent')
    if (chartZone.classList.contains('expanded')) {
        chartZone.classList.remove('expanded');
    } else {
        chartZone.classList.add('expanded');
    }
    // Progress Bar
    if (chartZone.classList.contains('expanded')) {
      slideContent.innerHTML = `
          <div class="display-zone">
              <div class="chart-expand">
                  <h2>Progress Bar</h2>
                  <div class="chart-zone">
                    <div class="chart-zone-left">
                      <div class="progress-bar-expand week">
                        <div class="info-expand">
                          <p>Week</p>
                          <p class="progress-text-expand">0%</p>
                        </div>
                        <div id="progress-container-expand">
                            <div id="progress-bar-expand"></div>
                        </div>
                      </div>
                      <div class="summary" id="summary-week">
                        <p>Tasks completed: <span class="bold" id="completed-week">0</span></p>
                        <p>Tasks created: <span class="bold" id="created-week">0</span></p>
                      </div>
                      <div class="progress-bar-expand month">
                        <div class="info-expand">
                          <p>Month</p>
                          <p class="progress-text-expand">0%</p>
                        </div>
                        <div id="progress-container-expand">
                            <div id="progress-bar-expand"></div>
                        </div>
                      </div>
                      <div class="summary" id="summary-month">
                        <p>Tasks completed: <span class="bold" id="completed-month">0</span></p>
                        <p>Tasks created: <span class="bold" id="created-month">0</span></p>
                      </div>
                    </div>
                    <div class="chart-zone-right">
                      <h3> Insights </h3> 
                      <div class="textarea-container textarea-container-1">
                        <textarea class="textarea-1" id="insights-progress" disabled></textarea> 
                        <div class="placeholder">Generating your insights...</div>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
          <div class="display-zone">
              <div class="chart-expand">
                  <h2>Tasks Distribution</h2>  
                  <div class="chart-zone">
                    <div class="chart-zone-left">
                      <div class="chart-container">
                        <canvas id="donutChart"></canvas>
                      </div>
                    </div>
                    <div class="chart-zone-right">
                      <div class="legend-1">
                        <div class="legend-item">
                          <div class="color-expand color-1"></div>
                          <p class="text-expand">Growth</p>
                        </div>
                        <div class="legend-item">
                          <div class="color-expand color-2"></div>
                          <p class="text-expand">Design</p>
                        </div>
                        <div class="legend-item">
                          <div class="color-expand color-3"></div>
                          <p class="text-expand">Development</p>
                        </div>
                      </div>
                      <div class="legend-2">
                        <div class="legend-item">
                          <div class="color-expand color-4"></div>
                          <p class="text-expand">Marketing</p>
                        </div>
                        <div class="legend-item">
                          <div class="color-expand color-5"></div>
                          <p class="text-expand">Other</p>
                        </div>
                      </div>
                      <h3> Insights </h3>
                      <div class="textarea-container textarea-container-2">
                        <textarea class="textarea-2" id="insights-tasks" placeholder="Generating your insights..." disabled></textarea> 
                        <div class="placeholder">Generating your insights...</div>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
          <div class="display-zone">
              <div class="chart-expand">
                  <h2>Priority vs. Completion Rate</h2>  
                  <div class="chart-zone">
                    <div class="chart-zone-left">
                      <div class="chart-container-3">
                        <canvas id="radarChart"></canvas>
                      </div>
                    </div>
                    <div class="chart-zone-right">
                      <div class="third-legend">
                        <div class="legend-item">
                          <div class="color-3-1"></div>
                          <p id="c-legend" class="text-3">Completion Rate</p>
                        </div>
                        <div class="legend-item">
                          <div class="color-3-2"></div>
                          <p id="p-legend" class="text-3">Average Priority</p>
                        </div>
                      </div>
                      <h3> Insights </h3>
                      <div class="textarea-container textarea-container-3">
                        <textarea class="textarea-3" id="insights-priority-completion" placeholder="Generating your insights..." disabled></textarea>
                        <div class="placeholder">Generating your insights...</div>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
      `;
        
      async function getChatbotResponse(section) {
        try {
          const response = await fetch('/plot_response');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          
          // Add artificial delay to maintain the loading animation effect
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          return data[section].response;
        } catch (error) {
          console.error('Error fetching response:', error);
          throw error;
        }
      }
      
      async function loadChatbotResponse(section) {
        const insightsTextarea = document.getElementById(`insights-${section}`);
        const textareaContainer = insightsTextarea.closest('.textarea-container');
        const placeholder = textareaContainer.querySelector('.placeholder');
        placeholder.style.fontSize = '18px';
      
        try {
          textareaContainer.classList.add('loading');
          const dotAnimation = animateDots(placeholder);
          const response = await getChatbotResponse(section);
          clearInterval(dotAnimation);
          placeholder.style.display = 'none';
          textareaContainer.classList.remove('loading');
          await typeResponse(response, insightsTextarea);
          insightsTextarea.disabled = false;
        } catch (error) {
          console.error('Error getting chatbot response:', error);
          placeholder.textContent = 'Error loading response';
          textareaContainer.classList.remove('loading');
        }
      }
      
      function animateDots(element) {
        let dots = 0;
        return setInterval(() => {
          dots = (dots + 1) % 4;
          element.style.fontSize = '18px';
          element.textContent = "Generating your insights" + ".".repeat(dots);
        }, 500);
      }
      
      async function typeResponse(text, element) {
        for (let i = 0; i < text.length; i++) {
          element.value += text.charAt(i);
          element.scrollTop = element.scrollHeight;
          await new Promise(resolve => setTimeout(resolve, 50)); // Adjust typing speed here
        }
      }
      
      function init() {
        loadChatbotResponse('progress'); // Load first section
        loadChatbotResponse('tasks');    // Load second section
        loadChatbotResponse('priority-completion'); // Load third section
      }
      
      init();

      // Slide 2
      // Define color schemes for both themes
      const blueThemeColors = {
          backgroundColor: [
              'rgba(13, 71, 161, 0.8)',
              'rgba(25, 118, 210, 0.8)',
              'rgba(33, 150, 243, 0.8)',
              'rgba(100, 181, 246, 0.8)',
              'rgba(189, 224, 254, 0.8)'
          ],
          hoverBackgroundColor: [
              'rgba(13, 71, 161)',
              'rgba(25, 118, 210)',
              'rgba(33, 150, 243)',
              'rgba(100, 181, 246)',
              'rgba(189, 224, 254)'
          ]
      };

      const pinkThemeColors = {
          backgroundColor: [
              'rgba(128, 15, 47, 0.8)',
              'rgba(201, 24, 74, 0.8)',
              'rgba(255, 117, 143, 0.8)',
              'rgba(255, 179, 193, 0.8)',
              'rgba(255, 240, 243, 0.8)'
          ],
          hoverBackgroundColor: [
              'rgba(128, 15, 47)',
              'rgba(201, 24, 74)',
              'rgba(255, 117, 143)',
              'rgba(255, 179, 193)',
              'rgba(255, 240, 243)'
          ]
      };

      let doughnutChart; // Global variable to store chart instance

      async function renderDoughnutChart() {
          const data = await fetchData();
          if (!data) return;

          const labels = data.categories.map(item => item[0]);
          const values = data.categories.map(item => item[1]);

          const taskType = document.querySelectorAll('.text-expand');
          taskType.forEach((item, index) => {
              item.textContent = labels[index];
          });

          const isPinkTheme = document.body.classList.contains('pink-theme');
          const currentColors = isPinkTheme ? pinkThemeColors : blueThemeColors;

          const chartData = {
              labels: labels,
              datasets: [{
                  label: "Task Distribution",
                  data: values,
                  backgroundColor: currentColors.backgroundColor,
                  hoverBackgroundColor: currentColors.hoverBackgroundColor,
              }]
          };

          const ctx = document.getElementById('donutChart').getContext('2d');
          
          // Destroy existing chart if it exists
          if (doughnutChart) {
              doughnutChart.destroy();
          }
          
          doughnutChart = new Chart(ctx, {
              type: 'doughnut',
              data: chartData,
              options: {
                  responsive: true,
                  plugins: {
                      legend: {
                          display: false,
                      },
                      tooltip: {
                          callbacks: {
                              label: function(context) {
                                  const total = context.dataset.data.reduce((acc, value) => acc + value, 0);
                                  const percentage = ((context.raw / total) * 100).toFixed(2);
                                  return ` ${context.label}: ${percentage}%`;
                              }
                          },
                          titleFont: {
                              size: 16,
                          },
                          bodyFont: {
                              size: 14,
                          },
                          footerFont: {
                              size: 14,
                          }
                      }
                  }
              }
          });
      }

      // Theme toggle handler
      const theme = document.getElementById('theme');
      theme.onclick = function() {
          document.body.classList.toggle('pink-theme');
          renderDoughnutChart(); // Re-render the chart with new colors
      }

      // slide 3

      async function createRadarChart() {
        const data = await fetchData();
        if (!data) return;

        // Extract labels and values
        const labels = data.categories.map(item => item[0]);
        const completionRates = data.categories.map(item => item[3]);
        const priorities = data.categories.map(item => item[4]);

        // Create the radar chart
        const ctx = document.getElementById('radarChart').getContext('2d');
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Completion Rate (%)',
                        data: completionRates,
                        borderColor: 'rgba(67, 97, 238, 1)',
                        backgroundColor: 'rgba(67, 97, 238, 0.2)',
                        borderWidth: 2,
                    },
                    {
                        label: 'Average Priority',
                        data: priorities.map(p => p * 20),
                        borderColor: 'rgba(255, 102, 157, 1)',
                        backgroundColor: 'rgba(255, 102, 157, 0.2)',
                        borderWidth: 2,
                    }
                ]
            },
            options: {
                scales: {
                    r: {
                        angleLines: {
                            display: true,
                            color: 'white',
                        },
                        grid: {
                            color: 'white',
                        },
                        pointLabels: {
                            font: { 
                                size: 16,
                                weight: 'bold',
                            },
                            color: 'white',
                        },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        ticks: {
                            font: { 
                                size: 14,
                                backgroundColor: 'none',
                            },
                            display: false,
                            color: 'white',
                            stepSize: 50,
                            callback: function(value) {
                                if ([50, 100].includes(value)) {
                                    return value + '%';
                                }
                                return '';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        bodyFont: {
                            size: 16,
                        },
                        titleFont: {
                            size: 16,
                        },

                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label;
                                let value = context.raw;
                                
                                if (label === 'Average Priority') {
                                    value = (value / 20).toFixed(1);
                                }
                                
                                return ` ${label}: ${value}`;
                            }
                        }
                    },
                    legend: {
                        display: false,
                    }
                }
            }
        });
    }

      // Initialize the chart
      createRadarChart().catch(error => {
          console.error('Error creating radar chart:', error);
      });

      // Initial render
      renderDoughnutChart();

      renderProgressBarsExpanded();
    } else {
      slideContent.innerHTML = `
          <div class="display-zone">
              <div class="chart chart-1">
                  <h2>Progress Bar</h2>
                  <div class="progress-bar week">
                    <div class="info">
                      <p>Week</p>
                      <p class="progress-text">0%</p>
                    </div>
                    <div id="progress-container">
                        <div id="progress-bar"></div>
                    </div>
                    
                  </div>
                  <div class="progress-bar month">
                    <div class="info">
                      <p>Month</p>
                      <p class="progress-text">0%</p>
                    </div>
                    <div id="progress-container">
                        <div id="progress-bar"></div>
                    </div>
                  </div>
                  <div id="summary" style="display: none"></div>
              </div>
          </div>
          <div class="display-zone">
              <div class="chart chart-2">
                  <h2>Tasks Distribution</h2>
                  <button class="switch-hour">Switch</button>
                  <div class="chart-2-container">
                    <div class="chart-2-items number1">
                      <div class="color color-1"></div>
                      <div class="text text-1">Growth</div>
                      <div class="percentage percentage-1">35%</div>
                    </div>
                    <div class="chart-2-items number2">
                      <div class="color color-2"></div>
                      <div class="text text-2">Growth</div>
                      <div class="percentage percentage-2">35%</div>
                    </div>
                    <div class="chart-2-items number3">
                      <div class="color color-3"></div>
                      <div class="text text-3">Growth</div>
                      <div class="percentage percentage-3">35%</div>
                    </div>
                    <div class="chart-2-items number4">
                      <div class="color color-4"></div>
                      <div class="text text-4">Growth</div>
                      <div class="percentage percentage-4">35%</div>
                    </div>
                    <div class="chart-2-items number5">
                      <div class="color color-5"></div>
                      <div class="text text-5">Growth</div>
                      <div class="percentage percentage-5">35%</div>
                    </div>
                  </div>
              </div>
          </div>
          <div class="display-zone">
            <div class="chart chart-3">
                <h2>Priorities vs. Completion Rate</h2>
                <div class="chart-3-container">
                  <div class="priority">
                    <p class="title">Priority ranking</p>
                    <div class="priority-ranking">
                      <p id="p-most" class="most important"></p>
                      <div id="priorityBar" class="priority-bar"></div>
                      <p id="p-least" class="least important"></p>
                    </div>
                  </div>
                  <div class="completion">
                    <p class="title">Completion rate ranking</p>
                    <div class="completion-ranking">
                      <p id="c-most" class="most important"></p>
                      <div id="completionBar" class="completion-bar"></div>
                      <p id="c-least" class="least important"></p>
                    </div>
                  </div>
                </div>
            </div>
          </div>
      `;
      renderProgressBars();
      renderEventTypes();
      Promise.all([createPriorityBar(), createCompletionBar()]);
    }
    
    async function renderProgressBarsExpanded() {
    const data = await fetchData();

    if (!data) return; // Exit if no data

    // Calculate progress for week
    const weekData = data.task_completion.find(item => item.time_period === 'week');
    const weekCompletionRate = weekData.tasks_assigned > 0
        ? (weekData.tasks_completed / weekData.tasks_assigned) * 100
        : 0;

    // Display the number of tasks completed and assigned
    const completedWeek = document.getElementById('completed-week');
    const createdWeek = document.getElementById('created-week');
    completedWeek.textContent = weekData.tasks_completed;
    createdWeek.textContent = weekData.tasks_assigned;

    // Update week progress bar
    const weekProgressBar = document.querySelector('.progress-bar-expand.week #progress-bar-expand');
    const weekProgressText = document.querySelector('.progress-bar-expand.week .progress-text-expand');

    weekProgressBar.style.width = weekCompletionRate + '%';
    weekProgressText.textContent = Math.round(weekCompletionRate) + '%';

    // Calculate progress for month
    const monthData = data.task_completion.find(item => item.time_period === 'month');
    const monthCompletionRate = monthData.tasks_assigned > 0
        ? (monthData.tasks_completed / monthData.tasks_assigned) * 100
        : 0;

    // Display the number of tasks completed and assigned
    const completedMonth = document.getElementById('completed-month');
    const createdMonth = document.getElementById('created-month');
    completedMonth.textContent = monthData.tasks_completed;
    createdMonth.textContent = monthData.tasks_assigned;

    // Update month progress bar
    const monthProgressBar = document.querySelector('.progress-bar-expand.month #progress-bar-expand');
    const monthProgressText = document.querySelector('.progress-bar-expand.month .progress-text-expand');

    monthProgressBar.style.width = monthCompletionRate + '%';
    monthProgressText.textContent = Math.round(monthCompletionRate) + '%';
    }

    // const insight = document.getElementById('insights');
    // insight.style.cssText = `height: ${insight.scrollHeight}px; overflow-y: hidden;`; 

    // insight.addEventListener('input', function () {
    //     this.style.height = 'auto';
    //     this.style.height = `${this.scrollHeight}px`;
    // });

    // Call the function to render progress bars
    renderProgressBarsExpanded();
    
    
});

var theme = document.getElementById('theme');
theme.onclick = function(){
  document.body.classList.toggle('pink-theme')
}

async function fetchData() {
    try {
        const response = await fetch('/plot_data'); // Adjust the path if necessary
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function renderProgressBars() {
    const data = await fetchData();

    if (!data) return; // Exit if no data

    // Calculate progress for week
    const weekData = data.task_completion.find(item => item.time_period === 'week');
    const weekCompletionRate = weekData.tasks_assigned > 0
        ? (weekData.tasks_completed / weekData.tasks_assigned) * 100
        : 0;

    // Update week progress bar
    const weekProgressBar = document.querySelector('.progress-bar.week #progress-bar');
    const weekProgressText = document.querySelector('.progress-bar.week .progress-text');

    weekProgressBar.style.width = weekCompletionRate + '%';
    weekProgressText.textContent = Math.round(weekCompletionRate) + '%';

    // Calculate progress for month
    const monthData = data.task_completion.find(item => item.time_period === 'month');
    const monthCompletionRate = monthData.tasks_assigned > 0
        ? (monthData.tasks_completed / monthData.tasks_assigned) * 100
        : 0;

    // Update month progress bar
    const monthProgressBar = document.querySelector('.progress-bar.month #progress-bar');
    const monthProgressText = document.querySelector('.progress-bar.month .progress-text');

    monthProgressBar.style.width = monthCompletionRate + '%';
    monthProgressText.textContent = Math.round(monthCompletionRate) + '%';
}

// Call the function to render progress bars
renderProgressBars();

// Function for slide 2

async function renderEventTypes() {
  const data = await fetchData();
  if (!data) return; // Exit if no data
  
  const labels = data.categories.map(item => item[0]);
  const valuesP = data.categories.map(item => item[1]);
  const valuesH = data.categories.map(item => item[2]);

  const taskType = document.querySelectorAll('.text');
  const percentage = document.querySelectorAll('.percentage');

  taskType.forEach((item, index) => {
    item.textContent = labels[index];
  });

  let showHours = true;

  function updateDisplay() {
    percentage.forEach((item, index) => {
      if (showHours) {
        item.textContent = valuesH[index] + 'h';
      } else {
        item.textContent = valuesP[index] + '%';
      }
    });
  }

  updateDisplay();

  const switchButton = document.querySelector('.switch-hour');
  switchButton.addEventListener('click', () => {
    showHours = !showHours;
    updateDisplay();
  });
}

renderEventTypes();

// Function for slide 3
// Create a single tooltip to be reused
const tooltip = document.createElement('div');
tooltip.className = 'tooltip';
document.body.appendChild(tooltip);

async function createPriorityBar() {
  const data = await fetchData();
  if (!data) return;

  const pBar = document.getElementById('priorityBar');
  const sortedCategories = data.categories.sort((a, b) => a[4] - b[4]);

  document.getElementById('p-most').textContent = sortedCategories[0][0];
  document.getElementById('p-least').textContent = sortedCategories[sortedCategories.length - 1][0];

  sortedCategories.forEach(category => {
    const [label, percentage, , , priority] = category;
    const section = document.createElement('div');
    section.className = 'bar-section';
    section.style.width = `${percentage}%`;

    section.addEventListener('mouseover', (e) => {
        tooltip.style.display = 'block';
        tooltip.textContent = `${label}, ${priority.toFixed(1)}`;
        tooltip.style.left = `${e.pageX - tooltip.offsetWidth/2}px`;
        tooltip.style.top = `${e.pageY - 30}px`;
        tooltip.style.fontSize = '16px';
    });

    section.addEventListener('mousemove', (e) => {
        tooltip.style.left = `${e.pageX - tooltip.offsetWidth/2}px`;
        tooltip.style.top = `${e.pageY - 30}px`;
    });

    section.addEventListener('mouseout', () => {
        tooltip.style.display = 'none';
    });

    pBar.appendChild(section);
  });
}

async function createCompletionBar() {
  const data = await fetchData();
  if (!data) return;

  const cBar = document.getElementById('completionBar');
  const sortedCategories = data.categories.sort((a, b) => a[3] - b[3]).reverse();

  document.getElementById('c-most').textContent = sortedCategories[0][0];
  document.getElementById('c-least').textContent = sortedCategories[sortedCategories.length - 1][0];

  sortedCategories.forEach(category => {
    const [label, percentage, , completion] = category;
    const section = document.createElement('div');
    section.className = 'bar-section';
    section.style.width = `${percentage}%`;

    section.addEventListener('mouseover', (e) => {
        tooltip.style.display = 'block';
        tooltip.textContent = `${label}, ${completion.toFixed(1)}%`;
        tooltip.style.left = `${e.pageX - tooltip.offsetWidth/2}px`;
        tooltip.style.top = `${e.pageY - 30}px`;
        tooltip.style.fontSize = '16px';
    });

    section.addEventListener('mousemove', (e) => {
        tooltip.style.left = `${e.pageX - tooltip.offsetWidth/2}px`;
        tooltip.style.top = `${e.pageY - 30}px`;
    });

    section.addEventListener('mouseout', () => {
        tooltip.style.display = 'none';
    });

    cBar.appendChild(section);
  });
}

// Create both bars
Promise.all([createPriorityBar(), createCompletionBar()]);


let currentSlide = 0;
const slides = document.querySelectorAll('.display-zone');
const totalSlides = slides.length;

function updateSlide() {
    const slideContent = document.getElementById('slideContent');
    slideContent.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateDots();
    updateProgressBar();
}

function updateDots() {
    const indicator = document.getElementById('indicator');
    indicator.innerHTML = ''; // Clear existing dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === currentSlide) {
            dot.classList.add('active'); // Enlarge the active dot
        }
        indicator.appendChild(dot);
    }
}


document.getElementById('nextButton').addEventListener('click', () => {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
    } else {
        currentSlide = 0; // Wrap around to the first slide
    }
    updateSlide();
});

document.getElementById('prevButton').addEventListener('click', () => {
    if (currentSlide > 0) {
        currentSlide--;
    } else {
        currentSlide = totalSlides - 1; // Wrap around to the last slide
    }
    updateSlide();
});

updateSlide();