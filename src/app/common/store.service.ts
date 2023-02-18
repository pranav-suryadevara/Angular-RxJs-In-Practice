import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, timer } from "rxjs";
import { fromPromise } from "rxjs/internal-compatibility";
import {
  delayWhen,
  filter,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
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

  selectCourseById(courseId: number) {
    return this.courses$.pipe(
      map(
        (courses) => courses.find((course) => course.id === courseId),
        filter((course) => !!course)
      )
    );
  }

  saveCourse(courseId: number, changes): Observable<any> {
    const courses = this.subject.getValue();

    const courseIndex = courses.findIndex((course) => course.id === courseId);

    const newCourses = courses.slice(0);

    newCourses[courseIndex] = { ...courses[courseIndex], ...changes }; // applying the changes on top of the copy

    this.subject.next(newCourses); // broadcasting the new courses object which has the changes that we made.

    return fromPromise(
      fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        body: JSON.stringify(changes),
        headers: {
          "content-type": "application/json",
        },
      })
    );
  }
}
