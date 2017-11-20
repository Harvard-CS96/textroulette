/**
 * reports.js
 * Controllers for generating reports against users.
 */

var mongoose = require('mongoose'),
Report = mongoose.model('Report');

function createReport(report) {
  Report.save({
    from: report.from,
    to: report. to,
    kind: report.kind
  })
}
