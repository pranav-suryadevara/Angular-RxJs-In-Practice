import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, timer } from "rxjs";
import { delayWhen, map, retryWhen, shareReplay, tap } from "rxjs/operators";
import { Course } from "../model/course";
import { createHttpObservable } from "./util";

@Injectable({ providedIn: "root" })
export class Store {
  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  init() {
    const http$ = createHttpObservable("/api/courses");

    http$
      .pipe(
        tap(() => console.log("HTTP request executed.")),
        map((res) => Object.values(res["payload"])),
        retryWhen((errors) => errors.pipe(delayWhen(() => timer(2000))))
      )
      .subscribe((courses) => this.subject.next(courses));
  }

  selectBeginnerCourses() {
    return this.filterByCategory("BEGINNER");
  }

  selectAdvancedCourses() {
    return this.filterByCategory("ADVANCED");
  }

  filterByCategory(category: string) {
    return this.courses$.pipe(
      map((courses) => courses.filter((course) => course.category === category))
    );
  }
}
