import React from 'react';
import Criticism from '../containers/Criticism';
import strings from '../json/strings.json';

class CriticismSet extends React.Component {
    componentDidMount() {
        this.props.loadAllCriticisms();
    }
    getOnClickCriticism = criticismId => {
        return () => {
            this.props.toggleCriticism(criticismId);
        }
    }
    renderCriticism = (criticism, i) => {
        const { criticismId, criticismName, enabled } = criticism;
        const onClick = this.getOnClickCriticism(criticismId)
        return <Criticism criticismId={criticismId} criticismName={criticismName} on={enabled === true} key={i} onClick={onClick} />
    }
    render() {
        const { selectedCriticisms } = this.props
        const { renderCriticism } = this;
        var renderedCriticisms = selectedCriticisms.map(renderCriticism);
        return <div id="CriticismSet">
            {renderedCriticisms}
        </div>
    }
}

export default CriticismSet;