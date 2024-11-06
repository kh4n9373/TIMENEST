function initializeProgressTracker() {
  const tracker = document.querySelector('.tracker');
  const progressBar = document.querySelector('.progress-bar');
  const timePeriod = document.querySelector('.time-period');

  const tasksData = {
    week: 35,
    month: 120,
    total: 200,
  };

  const progress = (tasksData.month / tasksData.total) * 100;
  progressBar.style.width = `${progress}%`;

  let isShowingWeek = true;

  tracker.addEventListener('mouseenter', updateProgressInfo);
  tracker.addEventListener('mouseover', () => {
    if (!timePeriod.style.opacity || timePeriod.style.opacity === '0') {
      updateProgressInfo();
    }
  });

  setInterval(() => {
    if (tracker.matches(':hover')) {
      updateProgressInfo();
    }
  }, 2000);

  function updateProgressInfo() {
    if (isShowingWeek) {
      timePeriod.textContent = `Week (${tasksData.week})`;
    } else {
      timePeriod.textContent = `Month (${tasksData.month})`;
    }
    isShowingWeek = !isShowingWeek;
  }
}
