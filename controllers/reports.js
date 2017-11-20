/**
 * reports.js
 * Controllers for generating reports against users.
 */

var mongoose = require('mongoose'),
Report = mongoose.model('Report');

function createReport(report) {
  const report = new Report({
    from: report.from,
    to: report.to,
    kind: report.kind
  });

  report.save((err) => {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = {
  createReport
}
