import Hydration from './Hydration';

export default class HydrationRepository {
  constructor(hydrationData) {
    this.rawHydrationData = hydrationData
    this.hydrationHistory = [];
    this.ouncesAverage = 0;
    this.ouncesRecord = [];
  }

  createHydration() {
    this.rawHydrationData.forEach(rawHydration => {
      let hydration = new Hydration(rawHydration);
      this.hydrationHistory.push(hydration);
    });
  }

  averageDailyOunces() {
    let totalDailyOunces = this.hydrationHistory.reduce((totalOunces, hydration) => {
      totalOunces += hydration.ounces;
      return totalOunces;
    }, 0)
    this.ouncesAverage = (totalDailyOunces / this.hydrationHistory.length).toFixed(1);
  }

}

// updateHydration(date, amount) {
//   this.ouncesRecord.unshift({[date]: amount});
//   if (this.ouncesRecord.length) {
//     this.ouncesAverage = Math.round((amount + (this.ouncesAverage * (this.ouncesRecord.length - 1))) / this.ouncesRecord.length);
//   } else {
//     this.ouncesAverage = amount;
//   }
// }

// addDailyOunces(date) {
//   return this.ouncesRecord.reduce((sum, record) => {
//     let amount = record[date];
//     if (amount) {
//       sum += amount
//     }
//     return sum
//   }, 0)
// }