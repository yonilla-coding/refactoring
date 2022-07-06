const statement = (invoice, plays) => {
  return renderPlainText(invoice, plays);
};

const renderPlainText = (invoice, plays) => {
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;

  const format = (aNumber) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber / 100);
  };

  const playFor = (aPerformance) => {
    return plays[aPerformance.playID];
  };

  const amountFor = (aPerformance) => {
    let result = 0;

    switch (playFor(aPerformance).type) {
      case "tragedy": {
        result = 40000;
        if (aPerformance.audience > 30)
          result += 1000 * (aPerformance.audience - 30);
        break;
      }
      case "comedy": {
        result = 30000;
        if (aPerformance.audience > 20)
          result += 10000 + 500 * (aPerformance.audience - 20);
        result += 300 * aPerformance.audience;
        break;
      }
      default:
        throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
    }

    return result;
  };

  const volumeCreditsFor = (aPerformance) => {
    let result = 0;

    result += Math.max(aPerformance.audience - 30, 0);
    if (playFor(aPerformance).type === "comedy")
      result += Math.floor(aPerformance.audience / 5);

    return result;
  };

  const totalVolumeCredits = () => {
    let volumeCredits = 0;

    for (let perf of invoice.performances) {
      volumeCredits += volumeCreditsFor(perf);
    }

    return volumeCredits;
  };

  const totalAmount = () => {
    let result = 0;

    for (let perf of invoice.performances) {
      result += amountFor(perf);
    }

    return result;
  };

  for (let perf of invoice.performances) {
    result += `  ${playFor(perf).name}: ${format(amountFor(perf))} (${
      perf.audience
    }석)\n`;
  }

  result += `총액: ${format(totalAmount())}\n`;
  result += `적립 포인트: ${totalVolumeCredits()}점\n`;
  return result;
};

export default statement;
