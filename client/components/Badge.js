import React from 'react';
import cn from 'classnames';
import strings from '../json/strings.json';

class Badge extends React.Component {
    render() {
        const { badgeId, name, count, on = true, onClick } = this.props;
        const renderedCount = count > 0 ?
            <div>{count}</div> :
            null;
        const className = cn([
            'Badge',
            { 'clickable': (typeof onClick === 'function') }
        ])
        const imgSuffix = on === true ?
            'on' :
            'off';
        return <div className={className} onClick={onClick}>
            <img src={"/static/badges/" + badgeId + "-" + imgSuffix + ".png"} width="100" height="100" />
            {name}
            {renderedCount}
        </div>
    }
}

export default Badge;