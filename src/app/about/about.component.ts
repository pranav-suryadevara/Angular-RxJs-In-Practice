import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { response } from "express";
import { fromEvent, interval, noop, Observable, observable, timer } from "rxjs";
import { map } from "rxjs/operators";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
