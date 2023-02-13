import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { fromEvent, interval, timer } from "rxjs";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    const interval$ = interval(1000);

    interval$.subscribe((val) => console.log("stream 1 => " + val));

    interval$.subscribe((val) => console.log("stream 2 => " + val));

    const timer$ = timer(3000, 1000);

    timer$.subscribe((val) => console.log("Timer stream 1 => " + val));

    const clicks$ = fromEvent(document, "click");

    clicks$.subscribe((event) => console.log(event));
  }
}
