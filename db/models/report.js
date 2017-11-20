const mongoose = require('mongoose');
require('mongoose-uuid2')(mongoose);
var UUID = mongoose.Types.UUID;

const ReportSchema = new mongoose.Schema({
  from: UUID,
  to: UUID,
  kind: String
});

module.exports = mongoose.model('Report', ReportSchema);