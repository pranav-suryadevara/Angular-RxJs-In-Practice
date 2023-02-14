import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { create } from "domain";
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

    const sub = interval1$.subscribe(console.log);

    setTimeout(() => sub.unsubscribe(), 5000);

    const http$ = createHttpObservable("/api/courses");

    const sub1 = http$.subscribe(console.log);

    setTimeout(() => sub1.unsubscribe, 0); // immediately calling the unsubscribe but in a different JS VM turn, we set the timeout to 0.
    // this way the browser will have the oppurtunity to trigger the ajax requst but the ajax request will be cancelled straight away.
    // The result, we should see a cancelled request in the network dev tools.
  }
}
