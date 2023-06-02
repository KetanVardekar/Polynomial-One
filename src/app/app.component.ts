import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2,private ngxService: NgxUiLoaderService,) { }

  ngOnInit() {
    //Start with light theme by default
    this.renderer.addClass(this.document.body, 'theme-dark');
  }
}
