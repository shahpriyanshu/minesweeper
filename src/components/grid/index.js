import React from 'react';
import Cell from '../cell';
import './_grid.css';

let count;
export default class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: new Array(props.rows).fill(0).map(x => new Array(props.cols).fill(0)),
            cellMap: {},
            count: props.stepCount || 0
        }
    }

    getRandomNumber = (limit) => {
        return Math.floor(Math.random() * Math.floor(limit));
    }

    componentDidMount() {
        // get mines on random positions
        const { grid } = this.state; 
        count = this.props.stepCount || 0;
        // generate hash map to memorize cell value and for easy read;
        let cellMap = this.generateCellMap();
        let minesMap = [];
        for (let k = 0; k < this.props.totalMines; k++) {
            let i = this.getRandomNumber(this.props.rows-1);
            let j = this.getRandomNumber(this.props.cols-1);
            cellMap[(i + "," + j)].value = "M";
            // grid[i][j] = 'M';
            minesMap.push(i + "," + j);
        }
        this.updateAdjacentCells(minesMap, cellMap);
        this.setState({
            grid, cellMap, minesMap
        })
    }

    generateCellMap = () => {
        const { grid } = this.state;
        let cellMap = {};
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                cellMap[i + "," + j] = { value: 0, revealed: false }
            }
        }
        return cellMap;
    }

    updateAdjacentCells = (minesMap, cellMap) => {
        const { grid } = this.state;
        let minesIndex = 0;
        while (minesIndex < minesMap.length) {
            const formattedCellIndex = this.formatCellIndex(minesMap[minesIndex]);
            const { rowIndex, colIndex } = formattedCellIndex;
            // scan row wise
            let startRowIndex = rowIndex > 0 ? rowIndex - 1 : rowIndex;
            let endRowIndex = rowIndex < grid.length - 1 ? rowIndex + 1 : rowIndex;

            let startColIndex = colIndex > 0 ? colIndex - 1 : colIndex;
            let endColIndex = colIndex < grid[rowIndex].length - 1 ? colIndex + 1 : colIndex;

            let row = startRowIndex, col = startColIndex;
            while (row <= endRowIndex) {
                while (col <= endColIndex) {
                    if (cellMap[row + "," + col].value !== 'M') {
                        cellMap[row + "," + col].value += 1;
                    }
                    col++;
                }
                col = startColIndex;
                row++;
            }
            minesIndex++;
        }
        return cellMap;
    }

    formatCellIndex = (cellIndex) => {
        const splitCellIndex = cellIndex.split(',');
        return {
            rowIndex: parseInt(splitCellIndex[0]),
            colIndex: parseInt(splitCellIndex[1])
        }
    }

    handleCellClick = (event) => {
        event.preventDefault();
        const clickedCellCoordinate = this.formatCellIndex(event.target.id);
        const { rowIndex, colIndex } = clickedCellCoordinate;
        this.revealCell(rowIndex, colIndex);
    }

    reveallAll = () => {
        const { cellMap } = this.state;
        for (const cellIndex in cellMap) {
            cellMap[cellIndex]['revealed'] = true;
        }
        this.setState({ cellMap})
    }

    revealCell = (rowIndex, colIndex) => {
        let { cellMap } = this.state;
        if (!cellMap[rowIndex + ',' + colIndex].revealed) {
            if (cellMap[rowIndex + ',' + colIndex].value === 'M') {
                cellMap[rowIndex + ',' + colIndex].revealed = true;
                this.reveallAll();
                this.props.setGameOver();
            } else if(cellMap[rowIndex + ',' + colIndex].value !== 0) {
                cellMap[rowIndex + ',' + colIndex].revealed = true;
                count++;
            } else {
                cellMap[rowIndex + ',' + colIndex].revealed = true;
                count++;
                this.floodFill(rowIndex, colIndex, cellMap);
            }

            this.setState({
                cellMap
            })
            this.setCount();
        }
    }

    setCount = () => {
        const { rows, cols, isGameOver } = this.props;
        if (!isGameOver && (rows*cols - this.state.minesMap.length === count)) {
            this.reveallAll();
            this.props.setStepCount(count, true)
        } else {
            this.props.setStepCount(count)
        }
    }

    floodFill = (rowIndex, colIndex, cellMap) => {
        const { grid } = this.state;
        let startRowIndex = rowIndex > 0 ? rowIndex - 1 : rowIndex;
        let endRowIndex = rowIndex < grid.length - 1 ? rowIndex + 1 : rowIndex;

        let startColIndex = colIndex > 0 ? colIndex - 1 : colIndex;
        let endColIndex = colIndex < grid[rowIndex].length - 1 ? colIndex + 1 : colIndex;

        let row = startRowIndex, col = startColIndex;
        while (row <= endRowIndex) {
            while (col <= endColIndex) {
                if (cellMap[row + "," + col].value !== 'M') {
                   this.revealCell(row, col);
                }
                col++;
            }
            col = startColIndex;
            row++;
        }
    }

    renderGrid = () => {
        const { grid, cellMap } = this.state;
        if (Object.entries(cellMap).length > 0) {
            return (
                <table className="grid">
                    {
                        grid.map((row, rowIndex) => {
                            return (
                                <tr>
                                    {
                                        row.map((cell, cellIndex) => {
                                            return (
                                                <td>
                                                    <Cell id={rowIndex + ',' + cellIndex} value={cellMap[rowIndex + ',' + cellIndex].value} isRevealed={cellMap[rowIndex + "," + cellIndex].revealed ? true : false} handleCellClick={(e) => this.handleCellClick(e)} />
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </table>
            )
        } else {
            return null;
        }
    }

    render() {

        return (
            <div>
                {this.renderGrid()}
            </div>
        )
    }
}