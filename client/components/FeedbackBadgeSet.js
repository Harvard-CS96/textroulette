import React from 'react';
import Badge from '../containers/Badge';
import strings from '../json/strings.json';

class FeedbackBadgeSet extends React.Component {
    componentDidMount() {
        this.props.loadAllBadges()
    }
    getOnClickBadge = badgeId => {
        return () => {
            this.props.toggleBadge(badgeId)
        }
    }
    renderBadge = (badge, i) => {
        const { badge: badgeId, enabled, count, name } = badge
        const onClick = this.getOnClickBadge(badgeId)
        return <Badge badgeId={badgeId} on={enabled === true} onClick={onClick} count={count} name={name} key={i} />
    }
    render() {
        const { badges } = this.props
        const { renderBadge } = this;
        var renderedBadges = badges.map(renderBadge);
        return <div id="FeedbackBadgeSet">
            {renderedBadges}
        </div>
    }
}

export default FeedbackBadgeSet;