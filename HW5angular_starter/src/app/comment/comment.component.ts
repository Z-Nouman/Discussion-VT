import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Comment} from '../_models/course';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})

export class CommentComponent implements OnInit {

  @Input() element: Comment;
  @Output() editEvent = new EventEmitter<Comment>();
  @Output() deleteEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  edit(element: any) {
      this.editEvent.emit(element);
  }

  delete(id: any) {
      this.deleteEvent.emit(id);
  }
}
