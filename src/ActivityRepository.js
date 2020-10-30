import Activity from './Activity';

export default class ActivityRepository {
  constructor(activityData, userStrideLength, userStepGoal) {
    this.rawActivityData = activityData
    this.activityHistory = [];
    this.userStepGoal = userStepGoal;
    this.userStrideLength = userStrideLength;
    this.totalStepsThisWeek = 0;
    this.accomplishedDays = [];
    this.trendingStepDays = [];
    this.trendingStairsDays = [];
  }

  start() {
    this.createActivities();
    this.findAccomplishedStepDays();
    this.findStairClimbingRecord();
    this.findTrendingStairsDays();
    this.findTrendingStepDays();
  }

  createActivities() {
    this.rawActivityData.forEach(rawActivity => {
      this.createInstance(rawActivity);
    });
  }

  createInstance(rawActivity) {
    let activity = new Activity(rawActivity);
    this.activityHistory.push(activity);
  }

  calculateMilesWalked(todayDate) {
    let todayActivity = this.activityHistory.find(activity => {
      return activity.date === todayDate
    })

    return ((todayActivity.steps * this.userStrideLength) / 5280).toFixed(1)
  }

  calculateActiveMinutes(todayDate) {
    let todayActivity = this.activityHistory.find(activity => {
      return activity.date === todayDate;
    })

    return todayActivity.minutesActive;
  }

  averageWeeklyMinutesActive(todayDate) {
    return (this.activityHistory.reduce((sum, activity) => {
      let index = this.activityHistory.indexOf(this.activityHistory.find(activity => activity.date === todayDate));
      if (index <= this.activityHistory.indexOf(activity) && this.activityHistory.indexOf(activity) <= (index + 6)) {
        sum += activity.minutesActive;
      }
      return sum;
    }, 0) / 7).toFixed(1);
  }

  reachStepGoal(todayDate) {
    let todayActivity = this.activityHistory.find(activity => {
      return activity.date === todayDate;
    })

    return (todayActivity.steps >= this.userStepGoal) ? true : false;
  }

  findAccomplishedStepDays() {
    let goodStepDays = this.activityHistory.filter(activity => {
      return activity.steps >= this.userStepGoal;
    })
    this.accomplishedDays = goodStepDays.map(activity => {
      return activity = {
        date: activity.date
      }
    })
  }

  findStairClimbingRecord() {
    let record = 0;
    this.activityHistory.forEach(activity => {
      if (activity.flightsOfStairs > record) {
        record = activity.flightsOfStairs;
      }
    })
    return record;
  }

  findTrendingStairsDays() {
   let positiveDays = [];
   this.activityHistory.forEach(activity => {
     if (positiveDays.length === 0) {
       positiveDays.push(activity)
     } else if (positiveDays[0].flightsOfStairs < activity.flightsOfStairs) {
       positiveDays.unshift(activity);
     } else if (positiveDays[0].flightsOfStairs > activity.flightsOfStairs) {
       positiveDays = [activity]
     }
     if (positiveDays.length > 2) {
       this.trendingStairsDays = positiveDays;
     }
   })
   if (this.trendingStairsDays.length > 2) {
     return `Your most recent positive climbing streak was ${this.trendingStairsDays[this.trendingStairsDays.length - 1].date} - ${this.trendingStairsDays[0].date}!`
   }
 }

  findTrendingStepDays() {
    let positiveDays = [];
    this.activityHistory.forEach(activity => {
      if (positiveDays.length === 0) {
        positiveDays.push(activity)
      } else if (positiveDays[0].steps < activity.steps) {
        positiveDays.unshift(activity);
      } else if (positiveDays[0].steps > activity.steps) {
        positiveDays = [activity]
      }
      if (positiveDays.length > 2) {
        this.trendingStepDays = positiveDays;
      }
    })
    if (this.trendingStepDays.length > 2) {
      return `Your most recent positive step streak was ${this.trendingStepDays[this.trendingStepDays.length - 1].date} - ${this.trendingStepDays[0].date}!`
    }
  }

  calculateAverageStepsThisWeek(todayDate) {
    return (this.activityHistory.reduce((sum, activity) => {
      let index = this.activityHistory.indexOf(this.activityHistory.find(activity => activity.date === todayDate));
      if (index >= this.activityHistory.indexOf(activity) && this.activityHistory.indexOf(activity) <= (index + 6)) {
        sum += activity.steps;
      }
      return sum;
    }, 0) / 7).toFixed(0);
  }

  calculateAverageFlightsThisWeek(todayDate) {
    return (this.activityHistory.reduce((sum, activity) => {
      let index = this.activityHistory.indexOf(this.activityHistory.find(activity => activity.date === todayDate));
      if (index >= this.activityHistory.indexOf(activity) && this.activityHistory.indexOf(activity) <= (index + 6)) {
        sum += activity.flightsOfStairs;
      }
      return sum;
    }, 0) / 7).toFixed(0);
  }
}


  // updateActivities(activity) {
  //   this.activityRecord.unshift(activity);
  //   if (activity.numSteps >= this.dailyStepGoal) {
  //     this.accomplishedDays.unshift(activity.date);
  //   }
  // }

  // calculateDailyCalories(date) {
  //   let totalMinutes = this.activityRecord.filter(activity => {
  //     return activity.date === date
  //   }).reduce((sumMinutes, activity) => {
  //     return sumMinutes += activity.minutesActive
  //   }, 0);
  //   return Math.round(totalMinutes * 7.6);
  // }


  // calculateTotalStepsThisWeek(todayDate) {
  //   this.totalStepsThisWeek = (this.activityRecord.reduce((sum, activity) => {
  //     let index = this.activityRecord.indexOf(this.activityRecord.find(activity => activity.date === todayDate));
  //     if (index <= this.activityRecord.indexOf(activity) && this.activityRecord.indexOf(activity) <= (index + 6)) {
  //       sum += activity.steps;
  //     }
  //     return sum;
  //   }, 0));
  // }
