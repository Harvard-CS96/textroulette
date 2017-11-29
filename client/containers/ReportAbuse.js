import { connect } from 'react-redux';
import _ReportAbuse from '../components/ReportAbuse';
import { operations as fOperations } from '../modules/report';

const { submitReport } = fOperations;


const mapStateToProps = (state, ownProps) => ({
})


const mapDispatchToProps = {
    submitReport
}

const ReportAbuse = connect(mapStateToProps, mapDispatchToProps)(_ReportAbuse);
export default ReportAbuse;
