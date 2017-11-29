/**
 * reports.js
 * Controllers for generating reports against users.
 */

var mongoose = require('mongoose'),
Report = mongoose.model('Report');
const { getMostRecent } = require('./chats');

function createReport(report) {
  const { from } = report;
  getMostRecent(from, mostRecent => {
    const { user1, user2 } = mostRecent; 
    const to = (user1 === from) ?
      user2 :
      user1;

    const report_doc = new Report({
      from,
      to,
      kind: report.kind,
      text: report.text
    });
  
    report_doc.save((err) => {
      if (err) {
        console.log(err);
      }
    });
  });
}

module.exports = {
  createReport
}
