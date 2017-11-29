import React from 'react';
import Badge from '../containers/Badge';
import strings from '../json/strings.json';

class BadgeSet extends React.Component {
    renderBadge = (badge, i) => {
        const { badge: badgeId, count } = badge
        return <Badge badgeId={badgeId} count={count} key={i} />
    }
    render() {
        const { badges } = this.props
        const { renderBadge } = this;
        var renderedBadges = badges.map(renderBadge);

        return <div id="BadgeSet">
            {renderedBadges}
        </div>
    }
}

export default BadgeSet;