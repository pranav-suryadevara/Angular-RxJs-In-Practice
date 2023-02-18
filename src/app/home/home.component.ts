import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, noop, Observable, of, timer } from "rxjs";
import {
  catchError,
  delayWhen,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  ngOnInit() {
    const http$ = createHttpObservable("/api/courses");

    const courses$: Observable<Course[]> = http$.pipe(
      tap(() => console.log("HTTP request executed.")),
      map((res) => Object.values(res["payload"])),
      shareReplay(),
      catchError((err) =>
        of([
          {
            id: 0,
            description: "RxJs In Practice Course",
            iconUrl:
              "https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png",
            courseListIcon:
              "https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png",
            longDescription:
              "Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples",
            category: "BEGINNER",
            lessonsCount: 10,
          },
        ])
      )
    );

    this.beginnerCourses$ = courses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === "BEGINNER")
      )
    );

    this.advancedCourses$ = courses$.pipe(
      map((courses: Course[]) =>
        courses.filter((course) => course.category === "ADVANCED")
      )
    );

    courses$.subscribe(
      (courses) => {
        console.log(courses);
      },
      noop, // () => {},  we can use noop instead of empty callback
      () => console.log("completed")
    );
  }
}
