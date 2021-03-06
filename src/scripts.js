import './css/_base.scss';
import './css/styles.scss';

import {dropdownEmail, dropdownFriendsStepsContainer, dropdownGoal, dropdownName, headerName, hydrationCalendarCard, hydrationFriendOuncesToday, hydrationFriendsCard, hydrationInfoCard, hydrationInfoGlassesToday, hydrationMainCard, hydrationUserOuncesToday, mainPage, profileButton, sleepCalendarCard, sleepCalendarHoursAverageWeekly, sleepCalendarQualityAverageWeekly, sleepFriendLongestSleeper, sleepFriendsCard, sleepFriendWorstSleeper, sleepInfoCard, sleepInfoHoursAverageAlltime, sleepInfoQualityAverageAlltime, sleepInfoQualityToday, sleepMainCard, sleepUserHoursToday, stairsCalendarCard, stairsCalendarFlightsAverageWeekly, stairsCalendarStairsAverageWeekly, stepsMainCard, stepsInfoCard, stepsFriendsCard, stepsTrendingCard, stepsCalendarCard, stairsFriendFlightsAverageToday, stairsFriendsCard, stairsInfoCard, stairsInfoFlightsToday, stairsMainCard, stairsTrendingButton, stairsTrendingCard, stairsUserStairsToday, stepsCalendarTotalActiveMinutesWeekly, stepsCalendarTotalStepsWeekly, stepsFriendAverageStepGoal, stepsInfoActiveMinutesToday, stepsInfoMilesWalkedToday, stepsFriendActiveMinutesAverageToday, stepsFriendStepsAverageToday, stepsTrendingButton, stepsUserStepsToday, trendingStepsPhraseContainer, trendingStairsPhraseContainer, userInfoDropdown, addActivityButton, addHydrationButton, addSleepButton, submitActivityButton, submitSleepButton, submitHydrationButton, activityStepsInput, activityMinutesInput, flightStairsInput, ouncesDrankInput, hoursSleptInput, sleepQualityInput, calendarInput, activityForm, sleepForm, hydrationForm, dropdownCalories, inputDate} from './DOMelements.js'

import UserRepository from './model/UserRepository';
import UserService from './service/UserService';
import SleepService from './service/SleepService';
import ActivityService from './service/ActivityService';
import HydrationService from './service/HydrationService';

let userRepository;
let user;
let todayDate = "2019/06/15";
let userDateInput;
let userService;
let sleepService;
let activityService;
let hydrationService;

window.onload = instantiateServices();

addActivityButton.addEventListener('click', showActivityForm);
addHydrationButton.addEventListener('click', showHydrationForm);
addSleepButton.addEventListener('click', showSleepData);
mainPage.addEventListener('click', showInfo);
profileButton.addEventListener('click', showDropdown);
stairsTrendingButton.addEventListener('click', updateTrendingStairsDays);
stepsTrendingButton.addEventListener('click', updateTrendingStepDays);
submitActivityButton.addEventListener('click', postActivityData);
submitHydrationButton.addEventListener('click', postHydrationData);
submitSleepButton.addEventListener('click', postSleepData);
calendarInput.addEventListener('change', (event) => {
  let formatDate = `${event.target.value}`.split('-');
  todayDate = formatDate.join('/');
  updateAllDisplays();
});
inputDate.addEventListener('change', (event) => {
  let formatDate = `${event.target.value}`.split('-');
  userDateInput = formatDate.join('/');
});

function instantiateServices() {
  userService = new UserService('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/users/userData', 'userData');
  sleepService = new SleepService('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/sleep/sleepData', 'sleepData');
  activityService = new ActivityService('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/activity/activityData', 'activityData');
  hydrationService = new HydrationService('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/hydration/hydrationData', 'hydrationData');
  fetchAllData();
}

function fetchAllData() {
  let userPromise = userService.fetchData();
  let sleepPromise = sleepService.fetchData();
  let activityPromise = activityService.fetchData();
  let hydrationPromise = hydrationService.fetchData();

  Promise.all([userPromise, sleepPromise, activityPromise, hydrationPromise])
    .then(data => userRepository = new UserRepository(data[0], data[1], data[2], data[3]))
    .then(() => loadPage())
    .catch(err => alert(`Sorry! Data cannot be loaded at this time ${err}`))
}

function loadPage() {
  userRepository.start();
  launchApp();
}

function launchApp() {
  getRandomUser();
  user.findFriendsNames(userRepository.users);
  updateAllDisplays();
}

function getRandomUser() {
  let randomIndex = Math.floor(Math.random() * 50);
  user = userRepository.users[randomIndex];
}

function flipCard(cardToHide, cardToShow) {
  cardToHide.classList.add('hide');
  cardToShow.classList.remove('hide');
}

function showDropdown() {
  userInfoDropdown.classList.toggle('hide');
}

function showInfo() {
  displaySleepInfo();
  displayActivityInfo();
  displayHydrationInfo();
}

function displaySleepInfo() {
  if (event.target.classList.contains('sleep-info-button')) {
    flipCard(sleepMainCard, sleepInfoCard);
  }
  if (event.target.classList.contains('sleep-friends-button')) {
    flipCard(sleepMainCard, sleepFriendsCard);
  }
  if (event.target.classList.contains('sleep-calendar-button')) {
    flipCard(sleepMainCard, sleepCalendarCard);
  }
  if (event.target.classList.contains('sleep-go-back-button')) {
    flipCard(event.target.parentNode, sleepMainCard);
  }
}

function displayActivityInfo() {
  if (event.target.classList.contains('steps-info-button')) {
    flipCard(stepsMainCard, stepsInfoCard);
  }
  if (event.target.classList.contains('steps-friends-button')) {
    flipCard(stepsMainCard, stepsFriendsCard);
  }
  if (event.target.classList.contains('steps-trending-button')) {
    flipCard(stepsMainCard, stepsTrendingCard);
  }
  if (event.target.classList.contains('steps-calendar-button')) {
    flipCard(stepsMainCard, stepsCalendarCard);
  }
  if (event.target.classList.contains('stairs-info-button')) {
    flipCard(stairsMainCard, stairsInfoCard);
  }
  if (event.target.classList.contains('stairs-friends-button')) {
    flipCard(stairsMainCard, stairsFriendsCard);
  }
  if (event.target.classList.contains('stairs-trending-button')) {
    flipCard(stairsMainCard, stairsTrendingCard);
  }
  if (event.target.classList.contains('stairs-calendar-button')) {
    flipCard(stairsMainCard, stairsCalendarCard);
  }
  if (event.target.classList.contains('steps-go-back-button')) {
    flipCard(event.target.parentNode, stepsMainCard);
  }
  if (event.target.classList.contains('stairs-go-back-button')) {
    flipCard(event.target.parentNode, stairsMainCard);
  }
}

function displayHydrationInfo() {
  if (event.target.classList.contains('hydration-info-button')) {
    flipCard(hydrationMainCard, hydrationInfoCard);
  }
  if (event.target.classList.contains('hydration-friends-button')) {
    flipCard(hydrationMainCard, hydrationFriendsCard);
  }
  if (event.target.classList.contains('hydration-calendar-button')) {
    flipCard(hydrationMainCard, hydrationCalendarCard);
  }
  if (event.target.classList.contains('hydration-go-back-button')) {
    flipCard(event.target.parentNode, hydrationMainCard);
  }
}

function updateAllDisplays() {
  updateUserDisplay();
  updateUserSleepDisplay();
  updateUserStepDisplay();
  updateUserStairDisplay();
  updateUserHydrationDisplay();
  updateUserFriendsDisplay();
}

function updateUserDisplay() {
  dropdownGoal.innerText = `DAILY STEP GOAL | ${user.dailyStepGoal}`;
  dropdownCalories.innerText = `DAILY CALORIES BURNED | ${user.activityRepository.calculateDailyCalories(todayDate)}`
  dropdownEmail.innerText = `EMAIL | ${user.email}`;
  dropdownName.innerText = user.name.toUpperCase();
  headerName.innerText = `${user.getFirstName()}'S `;
}

function updateUserSleepDisplay() {
  let longestSleeper = userRepository.getLongestSleeper(todayDate);
  let worstSleeper = userRepository.getWorstSleeper(todayDate);
  sleepInfoHoursAverageAlltime.innerText = user.sleepRepository.hoursSleptAverage;
  if (typeof longestSleeper === 'string') {
    sleepFriendLongestSleeper.innerText = longestSleeper;
  } else {
    sleepFriendLongestSleeper.innerText = longestSleeper.getFirstName();
  }
  if (typeof worstSleeper === 'string') {
    sleepFriendWorstSleeper.innerText = worstSleeper;
  } else {
    sleepFriendWorstSleeper.innerText = worstSleeper.getFirstName();
  }
  sleepInfoQualityAverageAlltime.innerText = user.sleepRepository.sleepQualityAverage;
  sleepCalendarHoursAverageWeekly.innerText = user.sleepRepository.averageWeeklySleepHours(todayDate);
  sleepCalendarQualityAverageWeekly.innerText = user.sleepRepository.averageWeeklySleepQuality(todayDate);
  sleepUserHoursToday.innerText = user.sleepRepository.findHoursSlept(todayDate);
  sleepInfoQualityToday.innerText = user.sleepRepository.findSleepQuality(todayDate);
}

function updateUserStepDisplay() {
  updateUserStepInfoCard();
  updateUserStepFriendsCard();
  updateTrendingStepDays();
  stepsCalendarTotalActiveMinutesWeekly.innerText = user.activityRepository.averageWeeklyMinutesActive(todayDate);
  stepsCalendarTotalStepsWeekly.innerText = user.activityRepository.calculateAverageStepsThisWeek(todayDate);
  stepsInfoActiveMinutesToday.innerText = user.activityRepository.calculateActiveMinutes(todayDate);
}

function updateUserStepInfoCard() {
  stepsUserStepsToday.innerText = user.activityRepository.findSteps(todayDate);

  stepsInfoMilesWalkedToday.innerText = user.activityRepository.calculateMilesWalked(todayDate);
}

function updateUserStepFriendsCard() {
  stepsFriendActiveMinutesAverageToday.innerText = userRepository.calculateAverageMinutesActive(todayDate);
  stepsFriendStepsAverageToday.innerText = userRepository.calculateAverageSteps(todayDate);
  stepsFriendAverageStepGoal.innerText = userRepository.calculateAverageStepGoal();
}

function updateUserStairDisplay() {
  updateUserStairInfoCard();
  updateUserStairFriendsCard();
  updateTrendingStairsDays();
  stairsCalendarFlightsAverageWeekly.innerText = user.activityRepository.calculateAverageStairsThisWeek(todayDate);
}

function updateUserStairInfoCard() {
  stairsUserStairsToday.innerText = user.activityRepository.findStairs(todayDate);
  stairsInfoFlightsToday.innerText = user.activityRepository.findFlightsOfStairs(todayDate);
}

function updateUserStairFriendsCard() {
  stairsCalendarStairsAverageWeekly.innerText = (userRepository.calculateAverageStairs(todayDate) * 12).toFixed(0);
  stairsFriendFlightsAverageToday.innerText = userRepository.calculateAverageStairs(todayDate).toFixed(0);
}

function updateUserHydrationDisplay() {
  updateWeeklyOuncesByDay();
  hydrationInfoGlassesToday.innerText = user.hydrationRepository.findOunces(todayDate);
  hydrationUserOuncesToday.innerText = user.hydrationRepository.findOunces(todayDate);
  hydrationFriendOuncesToday.innerText = userRepository.calculateAllOunces(todayDate);
}

function updateWeeklyOuncesByDay() {
  let hydrationDataByDate = user.hydrationRepository.findWeeklyOunces(todayDate);
  hydrationCalendarCard.innerHTML = `<button type='button' name='button' class='go-back-button hydration-go-back-button'></button>`
  let html;
  if (hydrationDataByDate.length < 7) {
    html = `<p class="weekly-ounces">Sorry, you only have ${hydrationDataByDate.length} day(s) of data. <br> Here is the info we have for the selected time period.</p><br>
    <p class="weekly-ounces">${hydrationDataByDate.map(data => {return `${data.date} ${data.ounces}OZ` + "<br>"}).join('')}</p>`
  } else {
    html = `<p class="weekly-ounces">WEEK OF: ${hydrationDataByDate[6].date}</p><br>
      <p class="weekly-ounces">YESTERDAY: ${hydrationDataByDate[0].ounces} OZ</p>
      <p class="weekly-ounces">2 DAYS: ${hydrationDataByDate[1].ounces} OZ</p>
      <p class="weekly-ounces">3 DAYS: ${hydrationDataByDate[2].ounces} OZ</p>
      <p class="weekly-ounces">4 DAYS: ${hydrationDataByDate[3].ounces} OZ</p>
      <p class="weekly-ounces">5 DAYS: ${hydrationDataByDate[4].ounces} OZ</p>
      <p class="weekly-ounces">6 DAYS: ${hydrationDataByDate[5].ounces} OZ</p>
      <p class="weekly-ounces">7 DAYS: ${hydrationDataByDate[6].ounces} OZ</p>`
  }
  hydrationCalendarCard.insertAdjacentHTML('beforeend', html)
}

function updateUserFriendsDisplay() {
  let friends = userRepository.getFriendsSteps(user.id, todayDate);

  let html = `<p class="dropdown-p">${friends.map(friend => {return `${friend.name} | ${friend.steps}` + "<br>"}).join('')}</p>`

  dropdownFriendsStepsContainer.innerHTML = html;
}

function updateTrendingStairsDays() {
  trendingStairsPhraseContainer.innerText = user.activityRepository.findTrendingStairsDays();
}

function updateTrendingStepDays() {
  trendingStepsPhraseContainer.innerHTML = user.activityRepository.findTrendingStepDays();
}

function showHomePage() {
  mainPage.classList.remove('hide');
  addActivityButton.classList.remove('hide');
  addHydrationButton.classList.remove('hide');
  addSleepButton.classList.remove('hide');
  calendarInput.classList.remove('hide');
  inputDate.classList.add('hide');
}

function hideHomePage() {
  mainPage.classList.add('hide');
  addActivityButton.classList.add('hide');
  addHydrationButton.classList.add('hide');
  addSleepButton.classList.add('hide');
  calendarInput.classList.add('hide');
  inputDate.classList.remove('hide');
}

function showActivityForm() {
  hideHomePage();
  activityForm.classList.remove('hide');
}

function showSleepData() {
  hideHomePage();
  sleepForm.classList.remove('hide');
}

function showHydrationForm() {
  hideHomePage();
  hydrationForm.classList.remove('hide');
}

function postActivityData() {
  let onSuccess = () => {
    showHomePage();
    activityForm.classList.add('hide');
  }
  let rawActivity = {userID: user.id, date: userDateInput, numSteps: activityStepsInput.value, minutesActive: activityMinutesInput.value, flightsOfStairs: flightStairsInput.value};
  user.activityRepository.createNewActivity(rawActivity);
  activityService.postData(rawActivity, onSuccess);
}

function postHydrationData() {
  let onSuccess = () => {
    showHomePage();
    hydrationForm.classList.add('hide');
  }
  let rawHydration = {userID: user.id, date: userDateInput, numOunces: ouncesDrankInput.value}
  user.hydrationRepository.createNewHydration(rawHydration);
  hydrationService.postData(rawHydration, onSuccess);
}

function postSleepData() {
  let onSuccess = () => {
    showHomePage();
    sleepForm.classList.add('hide');
  }
  let rawSleep = {userID: user.id, date: userDateInput, hoursSlept: hoursSleptInput.value, sleepQuality: sleepQualityInput.value}
  user.sleepRepository.createNewSleep(rawSleep);
  sleepService.postData(rawSleep, onSuccess);
}
