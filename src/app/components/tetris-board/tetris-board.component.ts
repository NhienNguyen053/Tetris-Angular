import { Component, OnInit, OnDestroy } from '@angular/core';
import { TetrisService } from '../../services/tetris.service';
import { Grid } from '../../types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tetris-board',
  templateUrl: './tetris-board.component.html',
  styleUrls: ['./tetris-board.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class TetrisBoardComponent implements OnInit, OnDestroy {
  grid: Grid = [];

  constructor(private tetrisService: TetrisService) {}

  ngOnInit(): void {
    this.tetrisService.grid$.subscribe((grid: Grid) => {
      this.grid = grid;
    });
  }

  ngOnDestroy(): void {
  }

  getCellClasses(column: any): { [key: string]: boolean } {
    const classes: { [key: string]: boolean } = {};
    if (column.value !== 0) {
      classes['filled'] = true;
      if (column.color) {
        classes[`color-${column.color.replace('#', '')}`] = true;
      }
    }
    return classes;
  }
}
