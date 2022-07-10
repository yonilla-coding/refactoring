class PerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  get amount() {
    let result = 0;

    switch (this.play.type) {
      case "tragedy": {
        result = 40000;
        if (this.performance.audience > 30)
          result += 1000 * (this.performance.audience - 30);
        break;
      }
      case "comedy": {
        result = 30000;
        if (this.performance.audience > 20)
          result += 10000 + 500 * (this.performance.audience - 20);
        result += 300 * this.performance.audience;
        break;
      }
      default:
        throw new Error(`알 수 없는 장르: ${this.play.type}`);
    }

    return result;
  }

  get volumeCredits() {
    let result = 0;

    result += Math.max(this.performance.audience - 30, 0);
    if (this.play.type === "comedy")
      result += Math.floor(this.performance.audience / 5);

    return result;
  }
}

const createStatementData = (invoice, plays) => {
  const result = {};

  const playFor = (aPerformance) => {
    return plays[aPerformance.playID];
  };

  const enrichPerformance = (aPerformance) => {
    const calculator = new PerformanceCalculator(
      aPerformance,
      playFor(aPerformance)
    );
    const result = { ...aPerformance };

    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;

    return result;
  };

  const totalAmount = (data) => {
    return data.performances.reduce((total, perf) => total + perf.amount, 0);
  };

  const totalVolumeCredits = (data) => {
    return data.performances.reduce(
      (total, perf) => total + perf.volumeCredits,
      0
    );
  };

  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumeCredits = totalVolumeCredits(result);

  return result;
};

export default createStatementData;
