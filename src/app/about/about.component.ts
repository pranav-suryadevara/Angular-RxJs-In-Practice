import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { response } from "express";
import {
  concat,
  fromEvent,
  interval,
  merge,
  noop,
  Observable,
  observable,
  of,
  timer,
} from "rxjs";
import { map } from "rxjs/operators";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    const interval1$ = interval(1000);

    const interval2$ = interval1$.pipe(map((val) => 10 * val));

    const result$ = merge(interval1$, interval2$);

    result$.subscribe(console.log);
  }
}
