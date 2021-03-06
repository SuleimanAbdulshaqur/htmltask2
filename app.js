/* eslint-disable no-unused-vars */
function submitForm() {
    const data = {
      region: {
        name: document.querySelector('.data-region').value,
        country: document.querySelector('.data-country').value,
      },
      periodType: document.querySelector('.data-period-type').value,
      timeToElapse: document.querySelector('.data-time-to-elapse').value,
      reportedCases: document.querySelector('.data-reported-cases').value,
      population: document.querySelector('.data-population').value,
      totalHospitalBeds: document.querySelector('.data-total-hospital-beds').value,
    };
  
    return data;
  }
  
  
  /* eslint-disable eqeqeq */
  /* eslint-disable max-len */
  // let data = {
  //   region: {
  //     name: 'Africa',
  //     avgAge: 19.7,
  //     avgDailyIncomeInUSD: 5,
  //     avgDailyIncomePopulation: 0.71,
  //   },
  //   periodType: 'days',
  //   timeToElapse: 58,
  //   reportedCases: 674,
  //   population: 66622705,
  //   totalHospitalBeds: 1380614,
  // };
  
  // work for challenge 3
  
  
  const infected = (reportedCases, x) => reportedCases * x;
  
  const infectionsByTime = (currentlyInfected, periodType, timeToElapse) => {
    let days;
  
    if (periodType == 'months') {
      days = timeToElapse * 30;
    } else if (periodType == 'weeks') {
      days = timeToElapse * 7;
    } else if (periodType == 'days') {
      days = timeToElapse;
    }
  
    return currentlyInfected * (2 ** (Math.floor(days / 3)));
  };
  
  const percentOfInfectection = (infectionsByRequestedTime) => ((15 / 100) * infectionsByRequestedTime);
  
  const availableBeds = (totalBeds, severeCases) => ((35 / 100) * totalBeds) - severeCases;
  
  const fivePerc = (infectionsByRequestedTime) => ((5 / 100) * infectionsByRequestedTime);
  
  const twoPerc = (infectionsByRequestedTime) => ((2 / 100) * infectionsByRequestedTime);
  
  const dollarGone = (infectionsByRequestedTime, dailyInc, incPop, periodType, timeToElapse) => {
    let days;
    if (periodType == 'months') {
      days = timeToElapse * 30;
    } else if (periodType == 'weeks') {
      days = timeToElapse * 7;
    } else {
      days = Math.round(timeToElapse);
    }
  
    return infectionsByRequestedTime * dailyInc * incPop * days;
  };
  
  const covid19ImpactEstimator = (data) => {
    const impact = {};
    const severeImpact = {};
    // Challenge 1
    // reported cases * 10 as currentlyInfected in impact
    impact.currentlyInfected = infected(data.reportedCases, 10);
    // reported cases * 50 as currentlyInfected in severeImpact
    severeImpact.currentlyInfected = infected(data.reportedCases, 50);
  
    // currentlyInfected for both cases * 2^factor for both imp and sevImp
    impact.infectionsByRequestedTime = infectionsByTime(impact.currentlyInfected, data.periodType, data.timeToElapse);
    severeImpact.infectionsByRequestedTime = infectionsByTime(severeImpact.currentlyInfected, data.periodType, data.timeToElapse);
  
    // Challenge 2
    // 15% of infectionbyreqtime as severeCasesByRequestedTime for both
    impact.severeCasesByRequestedTime = percentOfInfectection(impact.infectionsByRequestedTime);
    severeImpact.severeCasesByRequestedTime = percentOfInfectection(severeImpact.infectionsByRequestedTime);
  
    // hospitalBedsByRequestedTime = Hospitalbeds - sevCasebyReq
    impact.hospitalBedsByRequestedTime = availableBeds(data.totalHospitalBeds, impact.severeCasesByRequestedTime);
    severeImpact.hospitalBedsByRequestedTime = availableBeds(data.totalHospitalBeds, severeImpact.severeCasesByRequestedTime);
  
    // 5% of infectionsbyreqtime as casesForICUByRequestedTime
    impact.casesForICUByRequestedTime = fivePerc(impact.infectionsByRequestedTime);
    severeImpact.casesForICUByRequestedTime = fivePerc(severeImpact.infectionsByRequestedTime);
  
    // 2% of infectionsbyreqtime as casesForVentilatorsByRequestedTime
    impact.casesForVentilatorsByRequestedTime = twoPerc(impact.infectionsByRequestedTime);
    severeImpact.casesForVentilatorsByRequestedTime = twoPerc(severeImpact.infectionsByRequestedTime);
  
    // dollarsInFlight = infectionsbyreqtime * avgdailyinc * avgdailyincpop * timetoelapse
    impact.dollarsInFlight = dollarGone(impact.infectionsByRequestedTime, data.region.avgDailyIncomeInUSD, data.region.avgDailyIncomePopulation, data.periodType, data.timeToElapse);
    severeImpact.dollarsInFlight = dollarGone(severeImpact.infectionsByRequestedTime, data.region.avgDailyIncomeInUSD, data.region.avgDailyIncomePopulation, data.periodType, data.timeToElapse);
  
    return {
      data,
      impact,
      severeImpact,
    };
  };
  
  document.querySelector('.data-go-estimate').addEventListener('click', (e) => {
    e.preventDefault();
    covid19ImpactEstimator(submitForm());
    // console.log(submitForm());
  });
  
