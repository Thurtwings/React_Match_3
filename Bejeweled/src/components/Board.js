import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import './Board.css';

const Board = () => {
    const [board, setBoard] = useState([]);
    const [selectedGem, setSelectedGem] = useState(null);
    const totalGems = 8;
    const selectedCellClass = "selected-cell";
    useEffect(() => {
        initializeBoard();
    }, []);

    const initializeBoard = () => {
        let newBoard = new Array(8).fill(null).map(() => new Array(8).fill(null));

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                newBoard[i][j] = generateGem(i, j, newBoard);
            }
        }

        setBoard(newBoard);
    };

    const generateGem = (i, j, tempBoard) => {
        let gem;
        do {
            gem = Math.floor(Math.random() * totalGems) + 1;
        } while (
            (j >= 2 && tempBoard[i][j - 1] === gem && tempBoard[i][j - 2] === gem) ||
            (i >= 2 && tempBoard[i - 1][j] === gem && tempBoard[i - 2][j] === gem)
            );

        return gem;
    };

    const swapGems = (gem1, gem2) => {
        const newBoard = [...board];
        const tempGem = newBoard[gem1.i][gem1.j];
        newBoard[gem1.i][gem1.j] = newBoard[gem2.i][gem2.j];
        newBoard[gem2.i][gem2.j] = tempGem;
        setBoard(newBoard);
        checkAndRemoveAlignments(newBoard); // Vérifier et supprimer les alignements après la permutation
        shiftGemsDown();
    };

    const checkAndRemoveAlignments = (board) => {
        const alignmentsToRemove = checkAlignments(board);
        if (alignmentsToRemove.length > 0) {
            const newBoard = [...board];
            alignmentsToRemove.forEach((alignment) => {
                if (alignment.type === 'horizontal') {
                    for (let j = alignment.start; j <= alignment.end; j++) {
                        newBoard[alignment.row][j] = null;
                    }
                } else if (alignment.type === 'vertical') {
                    for (let i = alignment.start; i <= alignment.end; i++) {
                        newBoard[i][alignment.column] = null;
                    }
                }
            });
            setBoard(newBoard);
        }
    };

    const handleGemClick = (i, j) => {
        if (!selectedGem) {
            setSelectedGem({ i, j });
        } else {
            const gem1 = selectedGem;
            const gem2 = { i, j };

            const isAdjacent = Math.abs(gem1.i - gem2.i) + Math.abs(gem1.j - gem2.j) === 1;

            if (isAdjacent && isSwapValid(gem1, gem2)) {
                swapGems(gem1, gem2);
                shiftGemsDown();
            }

            setSelectedGem(null);
        }
    };

    const checkAlignments = (board) => {
        const alignments = [];

        // Vérifier les alignements horizontaux
        for (let i = 0; i < 8; i++) {
            let count = 1;
            for (let j = 1; j < 8; j++) {
                if (
                    board[i]?.[j] !== undefined &&
                    board[i]?.[j] === board[i]?.[j - 1] &&
                    board[i]?.[j] !== null
                ) {
                    count++;
                } else {
                    if (count >= 3) {
                        alignments.push({ type: 'horizontal', row: i, start: j - count, end: j - 1 });
                    }
                    count = 1;
                }
            }
            if (count >= 3) {
                alignments.push({ type: 'horizontal', row: i, start: 8 - count, end: 7 });
            }
        }

        // Vérifier les alignements verticaux
        for (let j = 0; j < 8; j++) {
            let count = 1;
            for (let i = 1; i < 8; i++) {
                if (
                    board[i]?.[j] !== undefined &&
                    board[i]?.[j] === board[i - 1]?.[j] &&
                    board[i]?.[j] !== null
                ) {
                    count++;
                } else {
                    if (count >= 3) {
                        alignments.push({ type: 'vertical', column: j, start: i - count, end: i - 1 });
                    }
                    count = 1;
                }
            }
            if (count >= 3) {
                alignments.push({ type: 'vertical', column: j, start: 8 - count, end: 7 });
            }
        }

        return alignments;
    };
    const isSwapValid = (gem1, gem2) => {
        const newBoard = JSON.parse(JSON.stringify(board)); // Utiliser une copie profonde du tableau pour éviter les références

        // Effectuer la permutation
        const tempGem = newBoard[gem1.i][gem1.j];
        newBoard[gem1.i][gem1.j] = newBoard[gem2.i][gem2.j];
        newBoard[gem2.i][gem2.j] = tempGem;

        // Vérifier si l'alignement est formé après la permutation
        const alignments = checkAlignments(newBoard);

        // Vérifier si l'alignement formé est lié à la permutation actuelle
        const isAlignedWithSwap = alignments.some((alignment) => {
            if (alignment.type === 'horizontal') {
                return (
                    (alignment.row === gem1.i && alignment.start <= gem1.j && gem1.j <= alignment.end) ||
                    (alignment.row === gem2.i && alignment.start <= gem2.j && gem2.j <= alignment.end)
                );
            } else if (alignment.type === 'vertical') {
                return (
                    (alignment.column === gem1.j && alignment.start <= gem1.i && gem1.i <= alignment.end) ||
                    (alignment.column === gem2.j && alignment.start <= gem2.i && gem2.i <= alignment.end)
                );
            }
            return false;
        });

        // Vérifier si le nouveau tableau forme un alignement valide
        const isNewAlignmentValid = alignments.some((alignment) => alignment.end - alignment.start >= 2);

        return isAlignedWithSwap || isNewAlignmentValid;
    };

    const shiftGemsDown = () => {
        const newBoard = JSON.parse(JSON.stringify(board)); // Utiliser une copie profonde du tableau pour éviter les références
        const emptySpaces = [];

        for (let j = 0; j < 8; j++) {
            emptySpaces[j] = 0;

            for (let i = 7; i >= 0; i--) {
                if (newBoard[i][j] === null) {
                    emptySpaces[j]++;
                } else if (emptySpaces[j] > 0) {
                    newBoard[i + emptySpaces[j]][j] = newBoard[i][j];
                    newBoard[i][j] = null;
                }
            }

            // Générer de nouvelles gemmes pour remplir les espaces vides en haut
            for (let i = 0; i < emptySpaces[j]; i++) {
                newBoard[i][j] = generateGem(i, j, newBoard);
            }
        }

        setBoard(newBoard);
        checkAlignments(newBoard);
    };

    return (
        <div className="board">
            {board.map((row, i) => (
                <div key={i} className="row">
                    {row.map((gem, j) => (
                        <Cell
                            key={j}
                            gem={gem}
                            isSelected={selectedGem && selectedGem.i === i && selectedGem.j === j}
                            onClick={() => handleGemClick(i, j)}
                            className={selectedGem && selectedGem.i === i && selectedGem.j === j ? selectedCellClass : ""}
                        />
                    ))}

                </div>
            ))}
        </div>
    );
};

export default Board;

