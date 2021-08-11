class Board{

    constructor() {
        this.currPlayer = 'black'
        this.board = this.newBoard()
        this.lastmovePassed = false
        this.attemptedSuicide = false
    }

    newBoard() {
        const board = []
        for (let i = 0; i < 13; i++) {
            board[i] = []
            for (let j = 0; j < 13; j++) {
                board[i][j] = null
            }
        }

        return board
    }

    getBoard() {
        return this.board
    }

    switchPlayer() {
        this.currPlayer = this.currPlayer === 'black' ? 'white' : 'black'
    }

    movePass() {
        if (this.lastmovePassed) {
            endGame()
        } else {
            this.lastmovePassed = true
            this.switchPlayer()
        }
    }

    endGame() {
        console.log('Game Over')
    }

    movePiece(x, y) {
        console.log(x + "" + y)
        this.attemptedSuicide = false
        if (this.board[x][y] != null) {
            return false
        }

        var color = this.board[x][y] = this.currPlayer
        var captured = []
        var neightbours = this.getAdjacent(x, y)
        var atari = false

        const self = this
        neightbours.forEach(function(n) {
            const state = self.board[n[0]][n[1]]
            if (state != null && state != color) {
                const group = self.getGroup(n[0], n[1])
                if (group['liberties'] === 0) {
                    captured.push(group)
                } else if (group['liberties'] == 1) {
                    atari = true
                }
            }
        })

        console.log(this.getGroup(x, y))

        if ((captured.length === 0) && this.getGroup(x, y)['liberties'] == 0) {
            this.board[x][y] = null
            this.attemptedSuicide = true
            return false
        }

        captured.forEach(function(group) {
            group['stones'].forEach(function(stone) {
                self.board[stone[0]][stone[1]] = 'dead'
            })
        })

        this.lastmovePassed = false
        return true
    }

    place(x, y) {
        this.board[x][y] = this.currPlayer
    }

    getAdjacent(x, y) {
        const neighbour = []
        if (x > 0) {
            neighbour.push([x - 1, y])
        }
        if (y < 12) {
            neighbour.push([x, y + 1])
        }
        if (x < 12) {
            neighbour.push([x + 1, y])
        }
        if (y > 0) {
            neighbour.push([x, y - 1])
        }
        return neighbour
    }

    getGroup(x, y) {
        const colour = this.board[x][y]
        if (colour === 'dead') {
            return null
        }

        var visited = []
        var visited_list = []
        var queue = [[x, y]]
        var count = 0

        while (queue.length > 0) {
            const stone = queue.pop()
            if (visited[stone]) {
                continue
            }

            const neighbours = this.getAdjacent(stone[0], stone[1])
            const self = this
            neighbours.forEach(function(n) {
                const state = self.board[n[0]][n[1]]
                if (state == null) {
                    count = count + 1
                }
                if (state == colour) {
                    queue.push(n[0], n[1])
                }
            })

            visited[stone] = true
            visited_list.push(stone)
        }

        return {
            'liberties' : count,
            'stones' : visited_list
        }
    }

    reset() {
        this.board = this.newBoard()
        this.currPlayer = 'black'
        this.lastmovePassed = false
        this.attemptedSuicide = false
    }
}

module.exports = Board