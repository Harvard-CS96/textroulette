/**
 * reports.js
 * Controllers for generating reports against users.
 */

var mongoose = require('mongoose'),
Report = mongoose.model('Report');

const chats = require('./chats');

function createReport(report) {
  chats.getMostRecent(report.from, res => {
    const report_to = res.user1 === report.from ? res.user2 : res.user1;
    const report_doc = new Report({
      from: report.from,
      to: report_to,
      kind: report.kind
    });

    report_doc.save((err) => {
      if (err) {
        console.log(err);
      }
    });
  })
}

module.exports = {
  createReport
}
