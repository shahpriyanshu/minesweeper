import React from 'react';

class Intro extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: null,
            col: null
        }
    }
    
    render() {
        return(
            <div name="myform" action="#" method="GET" >
            <label for="rows">Number of rows (between 5 and 40):</label>
            <br/>
            <input type="number" id="rows" name="rows" min="5" max="30" onChange={(e) => this.setState({ rows: e.target.value})}/>
            <br/><br/>
            <label for="columns">Number of columns (between 5 and 40):</label>
            <br/>
            <input type="number" id="columns" name="columns" min="5" max="30" onChange={(e) => this.setState({ col: e.target.value})}/>
            <br/><br/>
            <input type="submit" onClick={(e) => this.props.processInputs(e, this.state.rows, this.state.col)}/>
        </div>
        )
    }
}

export default Intro;