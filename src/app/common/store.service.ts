import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { Course } from "../model/course";

@Injectable({ providedIn: "root" })
export class Store {
  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();
}
