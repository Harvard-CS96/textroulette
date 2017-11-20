/**
 * reports.js
 * Controllers for generating reports against users.
 */

var mongoose = require('mongoose'),
Report = mongoose.model('Report');

function createReport(report) {
  const report_doc = new Report({
    from: report.from,
    to: report.to,
    kind: report.kind
  });

  report_doc.save((err) => {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = {
  createReport
}
