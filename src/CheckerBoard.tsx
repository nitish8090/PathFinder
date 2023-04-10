import './CheckerBoard.css'
import { useState, useEffect } from 'react';
import React from 'react';

class Box {
    x: number;
    y: number;

    constructor(x: number, y: number);
    constructor(id: string);
    constructor(...arr: any[]) {
        if (arr.length === 2) {
            this.x = arr[0];
            this.y = arr[1]
        }
        else if (arr.length === 1) {
            [this.x, this.y] = arr[0].split(',').map(Number)
        }
    }

    getAdjacentBoxes() {
        return [
            new Box(this.x - 1, this.y),    //T
            new Box(this.x, this.y - 1),    //L
            new Box(this.x + 1, this.y),    //B
            new Box(this.x, this.y + 1)     //R
        ]
    }

    getDistances(adjacentBoxes: Box[]) {
        return [
            Math.sqrt(Math.pow(this.x - adjacentBoxes[0].x, 2) + Math.pow(this.y - adjacentBoxes[0].y, 2)),
            Math.sqrt(Math.pow(this.x - adjacentBoxes[1].x, 2) + Math.pow(this.y - adjacentBoxes[1].y, 2)),
            Math.sqrt(Math.pow(this.x - adjacentBoxes[2].x, 2) + Math.pow(this.y - adjacentBoxes[2].y, 2)),
            Math.sqrt(Math.pow(this.x - adjacentBoxes[3].x, 2) + Math.pow(this.y - adjacentBoxes[3].y, 2))
        ]
    }

}

function timeout(delay: number) {
    return new Promise(res => setTimeout(res, delay));
}

function CheckerBoard() {
    const x = 100
    const y = 70

    const [selectedId, setSelectedId] = useState('')
    const [previousSelectedId, setPreviousSelectedId] = useState('');
    const [pathBlocks, setPathBlocks] = useState(['']);
    // const [wallBoxes, setWallBoxes] = useState(['20,50', '21,50', '22,50', '23,50', '24,50', '25,50', '26,50']);

    const mark = (e: React.MouseEvent<HTMLElement>) => {
        setPreviousSelectedId(selectedId)
        setSelectedId((e.target as HTMLElement).id)
    }

    let boxColumns = Array(y).fill(null).map((f, i) => {

        let boxRows = Array(x).fill(null).map((e, j) => {
            let style = {
                width: (window.innerWidth - 100) / x,
                backgroundColor: (i + j) % 2 == 0 ? 'grey' : 'white',
                border: (i + j) % 2 == 0 ? '0.5px solid black' : '0.5px solid white'
            }
            let id = i + ',' + j
            if (id === selectedId) {
                style.backgroundColor = 'red'
            }
            else if (id === previousSelectedId) {
                style.backgroundColor = 'green'
            }
            else if (pathBlocks.includes(id)) {
                style.backgroundColor = 'cyan'
            }
            // else if (wallBoxes.includes(id)) {
            //     style.backgroundColor = 'pink'
            // }

            return <div onClick={mark}
                className="box"
                style={style}
                key={'r' + j}
                id={id}
            >
            </div>
        })

        return <div className='box-column' key={'c' + i}> {boxRows} </div>
    })

    useEffect(() => {
        if (!previousSelectedId || !selectedId) { return }

        let newPathBlocks: string[] = []

        let selectedBox = new Box(selectedId)
        let destinationBox = new Box(previousSelectedId)

        let adjacentBoxes;
        let distances;
        let leastDistance = x * y;
        let closest;
        while (leastDistance > 0) {
            adjacentBoxes = selectedBox.getAdjacentBoxes()
            distances = destinationBox.getDistances(adjacentBoxes)
            leastDistance = Math.min.apply(null, distances)
            closest = distances.indexOf(leastDistance)
            selectedBox = adjacentBoxes[closest]
            newPathBlocks.push(selectedBox.x + ',' + selectedBox.y)
            setPathBlocks(newPathBlocks)
        }

    }, [selectedId])


    return (
        <div className='board'>{boxColumns}</div>
    )
}

export default CheckerBoard