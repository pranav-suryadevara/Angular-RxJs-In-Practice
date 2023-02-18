import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
  throttle,
  throttleTime,
  first,
  take,
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat, interval, forkJoin } from "rxjs";
import { Lesson } from "../model/lesson";
import { createHttpObservable } from "../common/util";
import { debug, RxJsLoggingLevel, setRxJsLoggingLevel } from "../common/debug";
import { Store } from "../common/store.service";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit, AfterViewInit {
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  courseId: number;

  @ViewChild("searchInput", { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.params["id"];

    this.course$ = this.store.selectCourseById(this.courseId).pipe(first());
    // this.course$ = this.store.selectCourseById(this.courseId).pipe(take(2));
    this.lessons$ = this.loadLessons();

    forkJoin(this.course$, this.lessons$).subscribe(console.log);
  }

  ngAfterViewInit() {
    this.lessons$ = fromEvent<any>(this.input.nativeElement, "keyup").pipe(
      map((event) => event.target.value),
      startWith(""),
      debug(RxJsLoggingLevel.TRACE, "search "),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((search) => this.loadLessons(search)),
      debug(RxJsLoggingLevel.DEBUG, "lessons value ")
    );
  }

  loadLessons(search = ""): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(map((res) => res["payload"]));
  }
}
