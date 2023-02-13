import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    document.addEventListener("click", (event) => {
      console.log(event);
    });

    let counter = 0;

    setInterval(() => {
      console.log(counter);
      counter++;
    }, 1000);

    setTimeout(() => {
      console.log("finished...", 2000);
    });
  }
}
