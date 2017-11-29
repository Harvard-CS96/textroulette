import { connect } from 'react-redux';
import _BadgeSet from '../components/BadgeSet';
import { selectors as userSelectors } from '../modules/user';

const { getBadges } = userSelectors;

const mapStateToProps = (state, ownProps) => ({
    badges: getBadges(state)
})


const mapDispatchToProps = {

} 

const BadgeSet = connect(mapStateToProps, mapDispatchToProps)(_BadgeSet);
export default BadgeSet;