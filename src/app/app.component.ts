import { Component, OnInit, HostListener } from '@angular/core';
import { TetrisService } from './services/tetris.service';
import { TetrisBoardComponent } from './components/tetris-board/tetris-board.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [TetrisBoardComponent]
})
export class AppComponent implements OnInit {
  isRunning: boolean = false;

  constructor(private tetrisService: TetrisService) {}

  ngOnInit(): void {
    this.tetrisService.isRunning$.subscribe((isRunning: boolean) => {
      this.isRunning = isRunning;
    });
  }

  startGame() {
    this.tetrisService.startGame();
  }

  stopGame() {
    this.tetrisService.stopGame();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.isRunning) return;

    switch (event.key) {
      case 'ArrowDown':
        this.tetrisService.moveTetromino('down');
        break;
      case 'ArrowLeft':
        this.tetrisService.moveTetromino('left');
        break;
      case 'ArrowRight':
        this.tetrisService.moveTetromino('right');
        break;
      default:
        break;
    }
  }
}
