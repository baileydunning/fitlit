import User from './User';

export default class UserRepository {
  constructor(userData, sleepData, activityData, hydrationData) {
    this.users = [];
    this.rawUserData = userData;
    this.rawSleepData = sleepData;
    this.rawActivityData = activityData;
    this.rawHydrationData = hydrationData;
  }

  start() {
    this.createUsers();
    this.users.forEach(user => {
      user.sleepRepository.start()
      user.activityRepository.start()
      user.hydrationRepository.start()
    })
  }

  createUsers() {
    this.rawUserData.forEach(rawUser => {
      let userSleepData = this.filterUserSleepData(rawUser.id);
      let userActivityData = this.filterUserActivityData(rawUser.id);
      let userHydrationData = this.filterUserHydrationData(rawUser.id);
      let user = new User(rawUser, userSleepData, userActivityData, userHydrationData);
      this.users.push(user);
    });
  }

  filterUserSleepData(id) {
    return this.rawSleepData.filter(sleep => {
      return sleep.userID === id;
    })
  }

  filterUserActivityData(id) {
    return this.rawActivityData.filter(activity => {
      return activity.userID === id;
    })
  }

  filterUserHydrationData(id) {
    return this.rawHydrationData.filter(hydration => {
      return hydration.userID === id;
    })
  }

  getUser(id) {
    return this.users.find(function(user) {
      return user.id === id;
    })
  }

  calculateAverageStepGoal() {
    let goals = this.users.map(function(user) {
      return user.dailyStepGoal;
    });
    let total = goals.reduce(function(sum, goal) {
      sum += goal;
      return sum;
    }, 0);
    return total / this.users.length;
  }

  calculateAverageSleepQuality() {
    let totalSleepQuality = this.users.reduce((sum, user) => {
      sum += user.sleepRepository.sleepQualityAverage;
      return sum;
    }, 0);
    return totalSleepQuality / this.users.length;
  }

  calculateAverageSteps(date) {
    let allUsersStepsCount = this.users.map(user => {
      return user.activityRepository.activityHistory.filter(activity => {
        return activity.date === date;
      });
    })
    let sumOfSteps = allUsersStepsCount.reduce((stepsSum, activityCollection) => {
      activityCollection.forEach(activity => {
        stepsSum += activity.steps
      })
      return stepsSum;
    }, 0);
    return Math.round(sumOfSteps / allUsersStepsCount.length);
  }

  calculateAverageStairs(date) {
    let allUsersStairsCount = this.users.map(user => {
      return user.activityRepository.activityHistory.filter(activity => {
        return activity.date === date;
      });
    })
    let sumOfStairs = allUsersStairsCount.reduce((stairsSum, activityCollection) => {
      activityCollection.forEach(activity => {
        stairsSum += activity.flightsOfStairs
      })
      return stairsSum;
    }, 0);
    return Math.round(sumOfStairs / allUsersStairsCount.length);
  }

  calculateAverageMinutesActive(date) {
    let allUsersMinutesActiveCount = this.users.map(user => {
      return user.activityRepository.activityHistory.filter(activity => {
        return activity.date === date;
      });
    })
    let sumOfMinutesActive = allUsersMinutesActiveCount.reduce((minutesActiveSum, activityCollection) => {
      activityCollection.forEach(activity => {
        minutesActiveSum += activity.minutesActive
      })
      return minutesActiveSum;
    }, 0);
    return Math.round(sumOfMinutesActive / allUsersMinutesActiveCount.length);
  }

  calculateAverageDailyWater(date) {
    let todaysDrinkers = this.users.filter(user => {
      return user.hydrationRepository.findOunces(date) > 0;
    });

    let ouncesConsumed = todaysDrinkers.reduce((sum, user) => {
      return sum += user.hydrationRepository.findOunces(date);
    }, 0);

    return Math.floor(parseInt(ouncesConsumed) / todaysDrinkers.length);
  }

  findBestSleepers(date) {
    let bestSleepers = this.users.filter(user => {
      return user.sleepRepository.averageWeeklySleepQuality(date) > 3;
    });

    return bestSleepers.map(user => {
      let avgSleepQuality = user.sleepRepository.averageWeeklySleepQuality(date);
      return user = {name: user.name, averageWeekSleepQuality: avgSleepQuality};
    });
  }

  getLongestSleeper(date) {
    let sleepsOnDate = this.users.map(user => {
      return user.sleepRepository.sleepHistory.find(sleep => {
        return sleep.date === date;
      })
    });

    let longestSleepers = sleepsOnDate.sort((a, b) => {
      return b.hoursSlept - a.hoursSlept;
    });

    return longestSleepers[0];
  }

  getWorstSleeper(date) {
    let sleepsOnDate = this.users.map(user => {
      return user.sleepRepository.sleepHistory.find(sleep => {
        return sleep.date === date;
      })
    });

    let shortestSleepers = sleepsOnDate.sort((a, b) => {
      return a.hoursSlept - b.hoursSlept;
    });

    return shortestSleepers[0];
  }
}
